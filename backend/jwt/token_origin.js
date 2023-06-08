const jwt = require("jsonwebtoken");
const database = require("../database");

// jwtKey =abc1234567;
module.exports = {
  getJwtKey: async () => {
    const result = await database.run(`SELECT * FROM jwtKey`);
    console.log("result token:" + result[0].jwtKey.toString());
    if (result && result.length > 0) {
      return result[0].jwtKey.toString(); // Convert jwtKey to a string
    } else {
      return null;
    }
  },
  sign: async (foundUser) => {
    const jwtKey = await module.exports.getJwtKey();
    console.log("foundUser: " + JSON.stringify(foundUser));
    if (!jwtKey) {
      throw new Error("JWT secret key not found");
    }
    const token = await jwt.sign(
      {
        user: {
          info: {
            // password: foundUser.info.password,
            // confirm_password: foundUser.info.confirm_password,
            name: foundUser[0].userName,
            email: foundUser[0].email,
          },
          checked: {
            // accepted: foundUser.checked.accepted,
            login_check: foundUser[0].login_check,
          },
        },
      },
      jwtKey,
      {
        expiresIn: "5m",
        issuer: "yeojin",
        // algorithm: "HS256",
      }
    );
    console.log("token.js -------->" + JSON.stringify(token));
    return token;
  },
  verify: async (req) => {
    const jwtKey = await module.exports.getJwtKey();
    if (!jwtKey) {
      throw new Error("JWT secret key not found");
    }
    // const authHeader = req.headers["authorization"];
    // const token = authHeader && authHeader.split(" ")[1];

    console.log("req.cookies.token: " + JSON.stringify(req.cookies.token));
    let decoded = null;
    try {
      decoded = await jwt.verify(req.cookies.token, jwtKey);
      console.log("decode on token.js: " + JSON.stringify(decoded));
      return decoded;
    } catch (err) {
      console.log(err + "decoded err");
      //err -> logout signal send
    }
  },
  refresh: async () => {
    /*
      1. login
      2. user id, pw check
      3. access, refresh token created and send;
      4. refresh token save to db
      5. logout
      6. access token expiration executed 
      7. login (refresh token is still alive)
      8. verify refresh token by comparing refresh token is in database
      9. access token send
      10.login(no token at all)
      11.user id, pw check 
      12.access, refresh token created and send;

      * when access token is alive(meaning user is on) and there is suspicious attempting for login
      * access 
      */

    const jwtKey = await module.exports.getJwtKey();
    if (!jwtKey) {
      throw new Error("JWT secret key not found");
    }
    return jwt.sign({}, jwtKey, {
      expiresIn: "3d",
      issuer: "yeojin",
    });
  },
  refreshVerify: async (username) => {
    const jwtKey = await module.exports.getJwtKey();
    if (!jwtKey) {
      throw new Error("JWT secret key not found");
    }
    try {
      const foundRefreshToken = await database.run(
        `SELECT refreshToken FROM user WHERE userName=?`,
        [username]
      );
      if (foundRefreshToken) {
        // required to check
        try {
          jwt.verify(foundRefreshToken, jwtKey);
          return true;
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  },
};
