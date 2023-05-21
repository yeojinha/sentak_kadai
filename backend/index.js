const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const database = require("./database");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(express.json());

const port = 3000;
const user = "";
const data = {
  list: [],
  user: {},
};
const userList = [];
const jwtKey = "abc1234567";
////////////////////------------------------USER------------------------//////////////////

//checking if user's cookies or token is still alive
// const cookieCheck = (req, res) => {

// };
app.get("/api/user", (req, res) => {
  if (req.cookies && req.cookies.token) {
    console.log(
      "back app.get user : " + req.cookies.token + "\ncookie: " + req.cookies
    );
    jwt.verify(req.cookies.token, jwtKey, (err, decoded) => {
      // if (err) {
      //   console.log("get cookie err 발생함: err " + err);
      //   res.sendStatus(401);
      // }
      res.send(decoded);
    });
  } else {
    // Return an empty response (200 OK) instead of 401 Unauthorized
    res.send();
  }
});

//signup
app.post("/api/user/signup", async (req, res) => {
  // await database.run(`INSERT INTO memos (content) VALUES (?)`, [
  //   req.body.content,
  // ]);
  // const result = await database.run("SELECT * FROM memos");
  // res.send(result);
  const found = await database.run(
    `SELECT userName FROM user WHERE userName=(?)`,
    [req.body.info.name]
  );

  /**
   * if(found) -> there is same Id on database -> reject signup
   */
  console.log("-----------");
  const userData = req.body;
  if (
    //same userName or email check if return;
    userList.find(
      (el) =>
        el.info.name == userData.info.name ||
        el.info.email == userData.info.email
    ) //change to sql ->
  ) {
    //if already userName is in the list
    console.log("user name or email");
    res.send();
  } else {
    //no same userName
    userList.push(userData); // change to sql ->
    console.log("back----------> " + JSON.stringify(userList));
    res.send(userData);
  }
});
// Login Logout
//Login
app.post("/api/user/login", async (req, res) => {
  const user = req.body;
  console.log("back username: " + user.name);
  console.log("back password: " + user.password);

  //find user
  const foundUser = await userList.find(
    (el) => el.info.name == user.name && el.info.password == user.password
  ); //change to sql ->
  //found

  console.log("foundUser login: " + JSON.stringify(foundUser));
  if (foundUser) {
    foundUser.checked.login_check = true; //change to sql ->

    const token = jwt.sign(
      {
        user: {
          info: {
            // password: foundUser.info.password,
            // confirm_password: foundUser.info.confirm_password,
            name: foundUser.info.name,
            email: foundUser.info.email,
          },
          checked: {
            // accepted: foundUser.checked.accepted,
            login_check: true,
          },
        },
      },
      jwtKey,
      {
        expiresIn: "5m",
        issuer: "yeojin",
      }
    );

    res.cookie("token", token); //set cookie browser
    res.send(foundUser); //send foundUser including cookie and jwt
  } else {
    res.send();
  }
});
//Logout
app.delete("/api/user/logout", (req, res) => {
  if (req.cookies && req.cookies.token) {
    //if user cookie found
    res.clearCookie("token"); //delete token cookie
  }
  res.sendStatus(200);
});
/////////////////////////////////////___________list_________/////////////////////////////////////////////////////
//delete
app.delete("/api/todolist", async (req, res) => {
  try {
    console.log("original List: " + JSON.stringify(data));
    console.log("req.id: " + req.query.id);
    /**
     * write below sql
     * 1. find target user by userName and delete target user
     *
     */
    const idx = await data.list.findIndex((el) => el.id == req.query.id); //find index by element id;

    if (idx !== -1) {
      //if no element idx is -1 else idx
      data.list.splice(idx, 1); //delete from idx, one object
    }
    console.log("deleted List: " + JSON.stringify(data));
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//add
app.post("/api/todolist", async (req, res) => {
  const formData = req.body;
  await data.list.push(formData); //change to sql -> push data by insert sql
  data.list.forEach((element) => {
    console.log("el.id: " + element.id);
  });
  //change to sql -> get data by select sql
  res.send(data);
});

//list show
app.get("/api/todolist", (req, res) => {
  // database.run("SELECT * FROM content");

  //get list data by select sql and put it data.list;
  if (req.cookies && req.cookies.token) {
    console.log(
      "list show app.get user : " +
        req.cookies.token +
        "\ncookie: " +
        req.cookies
    );
    jwt.verify(req.cookies.token, jwtKey, (err, decoded) => {
      // if (err) {
      //   console.log("get cookie err 발생함: err " + err);
      //   res.sendStatus(401);
      // }
      data.user = decoded;
      console.log("login data.user: " + JSON.stringify(data.user));
      //{"user":{"info":{"name":"123","email":"123"},"checked":{"login_check":true}},"iat":1684595112,"exp":1684595412,"iss":"yeojin"}
      res.send(data);
    });
  } else {
    // Return just list
    //change to sql -> get data list by select sql
    res.send(data.list);
  }
});

//hide and show
app.put("/api/todolist", async (req, res) => {
  //find object by id
  const found = await data.list.find((el) => el.id == req.body.id);
  found.isActive = req.body.isActive;
  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port http://127.0.0.1:${port}`);
});
