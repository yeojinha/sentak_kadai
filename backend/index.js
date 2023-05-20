const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
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
  }
  {
    // Return an empty response (200 OK) instead of 401 Unauthorized
    res.send();
  }
});

//signup
app.post("/api/user/signup", (req, res) => {
  console.log("-----------");
  const userData = req.body;
  userList.push(userData);
  console.log("back----------> " + JSON.stringify(userList));
  res.send(userData);
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
  );
  //found
  console.log("foundUser login: " + JSON.stringify(foundUser));
  if (foundUser) {
    foundUser.checked.login_check = true;
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
  await data.list.push(formData);
  data.list.forEach((element) => {
    console.log("el.id: " + element.id);
  });
  res.send(data);
});

//list show
app.get("/api/todolist", (req, res) => {
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
      console.log("data.user: " + JSON.stringify(data.user));
      res.send(data);
    });
  } else {
    // Return a list
    res.send(data.list);
  }
});

//hide and show
app.put("/api/todolist", async (req, res) => {
  //find object by id
  const found = await list.find((el) => el.id == req.body.id);
  found.isActive = req.body.isActive;
  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port http://127.0.0.1:${port}`);
});
