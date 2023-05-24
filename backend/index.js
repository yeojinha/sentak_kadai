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
const participants = {
  userName: "",
  email: "",
};
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
// const loginSetTrue = (user) => {
//   console.log("user.userName in loginSetTrue: " + user.userName);
//   database.run(`UPDATE user SET login_check='true' WHERE userName=?`, [
//     user.userName,
//   ]);
// };
const findUser = async (name, password) => {
  //using wiht async await
  let data = await database.run(
    `SELECT * FROM user WHERE userName = ? AND password = ?`,
    [name, password]
  );
  // console.log("findUser data: " + JSON.stringify(data));
  return data;
};
app.get("/api/user", (req, res) => {
  if (req.cookies && req.cookies.token) {
    console.log(
      "back app.get user : " + req.cookies.token + "\ncookie: " + req.cookies
    );
    jwt.verify(req.cookies.token, jwtKey, (err, decoded) => {
      res.send(decoded);
    });
  } else {
    // Return an empty response (200 OK) instead of 401 Unauthorized
    res.send();
  }
});

//signup
app.post("/api/user/signup", async (req, res) => {
  console.log("singup: " + JSON.stringify(req.body));
  /**
   * singup: {"info":{"password":"123","confirm_password":"123","name":"123","email":"123"},"checked":{"accepted":true,"login_check":false}}
-----------
back----------> [{"info":{"password":"123","confirm_password":"123","name":"123","email":"123"},"checked":{"accepted":true,"login_check":false}}]

   * 
   * 
   */

  // await database.run(`INSERT INTO memos (content) VALUES (?)`, [
  //   req.body.content,
  // ]);
  // const result = await database.run("SELECT * FROM memos");
  // res.send(result);
  // const found = await database.run(
  //   "SELECT userName, COUNT(userName) FROM user GROUP BY userName, HAVING COUNT(userName) > 0"
  // );
  console.log("req.body.info.name-> " + req.body.info.name);
  console.log("-----------");
  let userData = await findUser(req.body.info.name, req.body.info.password);

  // console.log("userData " + JSON.stringify(userData));
  console.log(
    "req.body.info.name, req.body.info.email, req.body.info.password: " +
      req.body.info.name,
    req.body.info.email,
    req.body.info.password
  );
  if (userData.length > 0) {
    //if already userName is in the list
    console.log("user name or email");
    res.send();
  } else {
    //no same userName
    // userList.push(userData); // change to sql ->
    await database.run(
      `INSERT INTO user (userName, email, password) VALUES(?,?,?)`,
      [req.body.info.name, req.body.info.email, req.body.info.password]
    );
    userData = await findUser(req.body.info.name, req.body.info.password);
    console.log("sign up ID check from db: " + userData);
    console.log(
      "back----------> " +
        JSON.stringify(await database.run("SELECT * FROM user;"))
    );
    res.send(userData);
  }
});
// Login Logout
//Login
app.post("/api/user/login", async (req, res) => {
  const user = req.body;
  console.log("user: " + JSON.stringify(user));
  console.log("back username: " + user.name);
  console.log("back password: " + user.password);
  let foundUser = null;

  foundUser = await findUser(user.name, user.password);

  console.log("foundUser login: " + JSON.stringify(foundUser));
  if (foundUser.length > 0) {
    foundUser[0].login_check = true; //change to sql ->
    // console.log("foundUser[0].userName: " + foundUser[0].userName);
    await database.run(`UPDATE user SET login_check='true' WHERE userName=?`, [
      foundUser[0].userName,
    ]);
    const token = jwt.sign(
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
      }
    );

    res.cookie("token", token); //set cookie browser
    //login true
    // await loginSetTrue(foundUser);
    res.send(foundUser[0]); //send foundUser including cookie and jwt
  } else {
    res.send();
  }
});
//Logout
app.delete("/api/user/logout", async (req, res) => {
  console.log("logout cookie check: " + JSON.stringify(req.body));
  if (req.cookies && req.cookies.token) {
    //if user cookie found
    await database.run(`UPDATE user SET login_check='false' WHERE userName=?`, [
      req.body.name,
    ]);
    res.clearCookie("token"); //delete token cookie
  }
  data.user = null; //when logout giving this null
  res.sendStatus(200);
});
/////////////////////////////////////___________list_________/////////////////////////////////////////////////////

/**
 * join부분에서
 * 1. 같은 방에 이미 join했으면 못하게 해야함
 * 2.
 *
 *
 */
//join
app.put(`/api/todolist/join`, async (req, res) => {
  console.log("join req.body: " + JSON.stringify(req.body.data)); //receiving name, id
  let list = await database.run("SELECT * FROM content");
  const already_join = await database.run(
    "SELECT * FROM participants_events WHERE id = ? AND userName =?",
    [req.body.data.id, req.body.data.name]
  );
  if (already_join.length >= 0) console.log("이미 존재");
  if (already_join.length <= 0) {
    console.log("req.body.data.name: " + req.body.data.name);
    await database.run(`UPDATE content SET participants = ? WHERE id = ?`, [
      //현재 참여 인원 수정
      req.body.data.num,
      req.body.data.id,
    ]);

    await database.run(
      `INSERT INTO participants_events (userName, id) VALUES(?,?)`,
      [req.body.data.name, req.body.data.id]
    );
  }
  list = await database.run("SELECT * FROM content");
  console.log("after join: " + JSON.stringify(list));
  res.send(list);
});
//delete
app.delete("/api/todolist/delete", async (req, res) => {
  try {
    console.log("req.id: " + JSON.stringify(req.body));
    /**
     * write below sql
     * 1. find target user by userName and delete target user
     *
     */
    const targetContent = req.body;

    await database.run(`DELETE FROM content WHERE id=?`, [targetContent.id]);
    await database.run(
      `DELETE FROM participants_events WHERE id=? AND userName=?`,
      [targetContent.id, targetContent.name]
    );
    // data.list = await database.run("SELECT * FROM content");
    // const idx = await data.list.findIndex((el) => el.id == req.query.id); //find index by element id;

    // if (idx !== -1) {
    //   //if no element idx is -1 else idx
    //   data.list.splice(idx, 1); //delete from idx, one object
    // }
    console.log("deleted List: " + JSON.stringify(data.list));
    data.list = await database.run("SELECT * FROM content");
    console.log(
      "data.list after delete on sever_side: " + JSON.stringify(data.list)
    );
    res.send(data.list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//add
app.post("/api/todolist/add", async (req, res) => {
  const formData = req.body;
  console.log("form data on add post: " + JSON.stringify(formData));
  await database.run(
    `INSERT INTO content(id, title, content, createdAt, userName,participants, \`limit\`) VALUES(?,?,?,?,?,?,?)`,
    [
      formData.id,
      formData.title,
      formData.content,
      formData.createdAt,
      formData.userName,
      formData.participants,
      formData.limit,
    ]
  );
  // await data.list.push(formData); //change to sql -> push data by insert sql
  const list = await database.run(`SELECT * FROM content`); //array returns
  console.log("add list :" + list);

  //change to sql -> get data by select sql
  res.send(list);
});

//list show
app.get("/api/todolist/show", async (req, res) => {
  data.list = await database.run("SELECT * FROM content");
  console.log("cookies: " + JSON.stringify(req.cookies));
  //get list data by select sql and put it data.list;
  if (req.cookies && req.cookies.token) {
    jwt.verify(req.cookies.token, jwtKey, (err, decoded) => {
      if (err) {
        console.log("list show " + err);
      }
      data.user = decoded;
      console.log("login data.user: " + JSON.stringify(data.user));
      //{"user":{"info":{"name":"123","email":"123"},"checked":{"login_check":true}},"iat":1684595112,"exp":1684595412,"iss":"yeojin"}
      res.send(data);
    });
  } else {
    res.send(data);
  }
});

//hide and show
app.put("/api/todolist", async (req, res) => {
  //find object by id
  const found = await data.list.find((el) => el.id == req.body.id);
  found.isActive = req.body.isActive;
  res.send(data);
});
//----------------------------------------------------------participants----------------------------------------------------------------------

app.listen(port, () => {
  console.log(`Example app listening on port http://127.0.0.1:${port}`);
});

//app.get  show executed first, second is login method <- this is problem that second method actually create token and add it to data; however
//if app.get show first, that is before the cookie created, so " if (req.cookies && req.cookies.token)" <- could't find cookie in it.
