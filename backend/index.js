const express = require("express");
const { sendMailMaster, newMemberMail, emailAuth } = require("./mail");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const schedule = require("node-schedule");

const database = require("./database");
const jwt = require("./jwt/token");

const { generateEmailCrytoForAuth } = require("./jwt/cryto");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
const port = 3000;
let token = null;
const data = {
  list: [],
  user: {},
};
// const jwtKey = "abc1234567";
// let jwtKey = null;
// const getJwtKey = async () => {
//   const result = await database.run(`SELECT * FROM jwtKey`);
//   if (result && result.length > 0) {
//     return result[0].jwtKey;
//   } else {
//     return null;
//   }
// };

app.put("/api/todolist/participants_events", async (req, res) => {
  console.log("/api/todolist/participants_events: " + JSON.stringify(req.body));
  let numberOf = 0;
  const temp = await database.run(
    //현 유저가 현 이벤트 참여 미참여중인지 체크
    `SELECT * FROM participants_events WHERE userName =? AND  id=? LIMIT 1`,
    [req.body.name, req.body.id]
  );
  console.log("temp: " + JSON.stringify(temp));

  let numberOfPart = await database.run(
    //이벤트에 대한 참가자수
    `SELECT participants FROM contents WHERE id=?`,
    [req.body.id]
  ); //현재 인원수

  console.log("numberOfPart: " + JSON.stringify(numberOfPart[0].participants));
  if (numberOfPart[0].participants >= 1) {
    numberOf = parseInt(numberOfPart[0].participants);
    console.log("numberOf: " + numberOf);
  }

  // console.log("numberOfPar: " + JSON.stringify(numberOfPart));
  if (temp.length > 0) {
    //참여중이면
    console.log("temp is in this event");
    await database.run(
      `DELETE FROM participants_events WHERE userName=? AND id=?`,
      [req.body.name, req.body.id]
    ); //해당 데이터 삭제
    numberOf--;
    console.log("in the event numberOfPar check: " + numberOf);
  } else {
    const content = await database.run(
      `SELECT email FROM user WHERE userName =?`,
      [req.body.name]
    );

    let info = {
      email: req.body.email,
      title: req.body.title,
      content: content[0].email,
    };
    console.log("temp is not in this event");
    //new participant
    //이벤트에 신규 참여할 유저
    numberOf++;

    console.log("Not in the event numberOfPar check: " + numberOf);
    await database.run(
      `INSERT INTO participants_events (userName, id) VALUES(?,?)`,
      [req.body.name, req.body.id]
    ); //데이터 다대다 테이블에 추가
    await database.run(
      `INSERT IGNORE INTO participants_events_history (userName, id) VALUES(?,?)`,
      [req.body.name, req.body.id] //ignore the data is already on the table;
    );
    newMemberMail(info);
  }
  await database.run(`UPDATE contents SET participants=? WHERE id=?`, [
    numberOf.toString(),
    req.body.id,
  ]); //인원 수 업데이트

  const data = {
    userJoinEventsId: await database.run(
      `SELECT id FROM participants_events WHERE userName = ?`,
      [req.body.name]
    ),
    eventsList: await database.run(
      "SELECT id, title, content, createdAt, userName, participants, `limit` FROM contents WHERE userName"
    ),
  };

  console.log(
    "back index.js data userJoinEventsId : " +
      JSON.stringify(data.userJoinEventsId)
  );
  console.log(
    "-----------------------------------------------------------------------"
  );
  console.log(
    "-----------------------------------------------------------------------"
  );
  for (let i = 0; i < data.eventsList.length; i++) {
    console.log(JSON.stringify(data.eventsList[i]));
  }
  // bakc index.js data : {"userJoinEventsId":[{"id":"1685067720021"}],"eventsList":[{"id":"1685067720021"}]}
  //접근방법 [idx].id
  const list = await database.run(
    "SELECT id, title, content, createdAt, userName, participants, `limit` FROM contents"
  );
  res.send(list); // sending the eventsId current user joined + eventsList;
});
////////////////////------------------------USER------------------------//////////////////

const findUser = async (name, password) => {
  //using wiht async await
  let data = await database.run(
    `SELECT userName,email,login_check,accepted,refreshToken FROM user WHERE userName = ? AND password = ?`,
    [name, password]
  );
  // console.log("findUser data: " + JSON.stringify(data));
  return data;
};
const loginTry = async (name, password) => {
  //using wiht async await
  let data = await database.run(
    `SELECT userName,email,login_check,accepted FROM user WHERE userName = ? AND password = ?`,
    [name, password]
  );
  // console.log("findUser data: " + JSON.stringify(data));
  return data;
};

app.get("/api/user", async (req, res) => {
  // jwtKey = await getJwtKey();tempDBclear();
  tempDBclear();
  if (req.cookies && req.cookies.token) {
    console.log(
      "back app.get user : " + req.cookies.token + "\ncookie: " + req.cookies
    );
    const decoded = await jwt.verify(req);
    console.log("DECODE: " + JSON.stringify(decoded));
    res.send(decoded);
  } else {
    res.send();
  }
});
app.get("/api/user/verify-email", async (req, res) => {
  const email = req.query.email;
  const token = req.query.token;
  console.log("token: " + token);

  console.log("email: " + email);
  const time = new Date().getTime();
  const foundToken = await database.run(
    `SELECT * FROM tempuser WHERE crytoToken = ?`,
    [token]
  );
  ///expire check
  if (foundToken.length <= 0) {
    alert("token expired!");
    return;
  }
  console.log("expiration check: " + time);
  console.log("foundToken[0].expiration: " + foundToken[0].expiration);
  let foundUser = null;
  if (foundToken[0].expiration >= time) {
    //유효기간 만료 X
    foundUser = await database.run(
      `SELECT userName, email, password FROM tempuser WHERE email = ?`,
      [email]
    );
    await database.run(
      `INSERT INTO user (userName, email, password) VALUES(?,?,?)`,
      [foundUser[0].userName, foundUser[0].email, foundUser[0].password]
    );
  } else if (foundToken[0].expiration < time) {
    res.sendStatus(400);
    console.log(
      "foundToken[0].expiration < time: " + foundToken[0].expiration < time
    );
  } //유효기간 만료 O

  console.log(
    "back----------> " +
      JSON.stringify(await database.run("SELECT * FROM user"))
  );
  // alert("Welcome!!! Your account has been verified.");
  res.redirect("http://localhost:8080/");
});
//signup
app.post("/api/user/signup", async (req, res) => {
  //tempDB_table에 임시유저와 비밀번호 그리고 인증번호를 입력하고
  //전송한 인증코드를 비교하기,.
  // 인증번호는 db와 함께 비교하기.
  /**
   * 1. 특정링크와 함께 인증코드 전송 혹은 특정링크에 인증코드 param으로 함께 전송
   * 2. 인증코드 포함이면 form에 입력하거 submit -> db에 유저 정보 post -> redirect to '/home'
   * 3. param으로 전송하면 2번과 같이 db에 유저 정보 post -> redirect to '/home'
   */
  console.log("singup: " + JSON.stringify(req.body));

  console.log("req.body.info.name-> " + req.body.info.name);
  console.log("-----------");
  let userData = await loginTry(req.body.info.name, req.body.info.password);

  // console.log("userData " + JSON.stringify(userData));
  console.log(
    "req.body.info.name, req.body.info.email, req.body.info.password: " +
      req.body.info.name,
    req.body.info.email,
    req.body.info.password
  );

  if (userData.length > 0) {
    //if already userName is in the list
    console.log("user name or email ");
    res.send();
  } else {
    //no same userName
    // userList.push(userData); // change to sql ->
    result = await generateEmailCrytoForAuth();
    // const tik_tok = await expiration();//현재시간 + 2시간
    console.log("time: " + result.time);
    await database.run(
      `INSERT INTO tempuser (userName,email,password,crytoToken,expiration) VALUES(?,?,?,?,?)`,
      [
        req.body.info.name,
        req.body.info.email,
        req.body.info.password,
        result.token,
        result.time,
      ]
    );
    emailAuth(req.body.info.email, result.token, result.expire);
    // userData = await loginTry(req.body.info.name, req.body.info.password);
    // console.log("sign up ID check from db: " + userData);
    // console.log(
    //   "back----------> " +
    //     JSON.stringify(await database.run("SELECT * FROM user;"))
    // );
    // res.send(userData);
  }
});
///////////////////

// Login Logout
//Login
app.post("/api/user/login", async (req, res) => {
  const user = req.body;
  let token = null;
  let foundUser = null;

  foundUser = await findUser(user.name, user.password);
  console.log("foundUser.userName: " + JSON.stringify(foundUser[0]));

  console.log("foundUser login: " + JSON.stringify(foundUser));
  if (foundUser.length > 0) {
    foundUser[0].login_check = true; //change to sql ->
    // console.log("foundUser[0].userName: " + foundUser[0].userName);
    await database.run(`UPDATE user SET login_check='true' WHERE userName=?`, [
      foundUser[0].userName,
    ]);
    if (await jwt.refreshVerify(foundUser[0].userName)) {
      //only access expired.
      token = await jwt.sign(foundUser);
      console.log("리프레쉬 토큰은 만들어지지 않는다, 왜냐 만료기한 전이라서");
    } else {
      //expired both tokens.
      token = await jwt.sign(foundUser);
      const refreshToken = await jwt.refresh();

      console.log("access token: " + JSON.stringify(token));
      console.log("refresh Token: " + JSON.stringify(refreshToken));
      await database.run(
        //refresh token into database
        "UPDATE user SET refreshToken = ? WHERE userName = ?",
        [refreshToken, foundUser[0].userName]
      );
    }
    res.cookie("token", token); //set cookie browser
    // res.cookie("refreshToken", refreshToken);//not recommendable
    // res.cookie("refreshToken", refreshToken);
    //login true
    console.log("foundUser" + JSON.stringify(foundUser[0]));
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
//delete
app.delete("/api/todolist/delete", async (req, res) => {
  try {
    console.log("req.id: " + JSON.stringify(req.body));

    const targetContent = req.body;

    await database.run(`DELETE FROM contents WHERE id=?`, [targetContent.id]);
    await database.run(
      `DELETE FROM participants_events WHERE id=? AND userName=?`,
      [targetContent.id, targetContent.name]
    );

    console.log("deleted List: " + JSON.stringify(data.list));
    data.list = await database.run(
      "SELECT id, title, content, createdAt, userName, participants, `limit` FROM contents"
    );
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
  const data = await database.run(`SELECT email FROM user WHERE userName = ?`, [
    formData.userName,
  ]);
  console.log("data: " + data[0].email);
  await database.run(
    `INSERT INTO contents(id, email,title, content, createdAt, userName,participants, \`limit\`) VALUES(?,?,?,?,?,?,?,?)`,
    [
      formData.id,
      data[0].email,
      formData.title,
      formData.content,
      formData.createdAt,
      formData.userName,
      formData.participants,
      formData.limit,
    ]
  );
  // await data.list.push(formData); //change to sql -> push data by insert sql
  const list = await database.run(
    "SELECT id, title, content, createdAt, userName, participants, `limit` FROM contents"
  ); //array returns
  console.log("add list :" + list);

  //change to sql -> get data by select sql
  res.send(list);
});

//list show

app.get("/api/todolist/getUser", async (req, res) => {
  if (req.cookies && req.cookies.token) {
    console.log("getUser: " + JSON.stringify(req.cookies.token));
    const user = await jwt.verify(req);
    res.send(user);
  } else {
    console.log("getUser: " + JSON.stringify(req.cookies.token));
    res.send();
  }
});
app.get("/api/todolist/my_challenges", async (req, res) => {
  const userName = req.query.userName;

  data.list = await database.run(`SELECT * FROM contents WHERE userName = ?`, [
    userName,
  ]);
  res.send(data);
});
app.get("/api/todolist/my_page_joined", async (req, res) => {
  //`SELECT pe.id, u.email, c.title FROM user AS u JOIN participants_events AS pe ON u.userName = pe.userName JOIN contents AS c ON pe.id=c.id`
  data.list = await database.run(
    `SELECT c.id, c.email, c.title, c.content, c.createdAt, c.userName, c.participants, c.limit, c.isActive FROM contents AS c JOIN participants_events AS pe ON c.id = pe.id WHERE pe.userName = ?`,
    [req.query.userName]
  );
  res.send(data);

  console.log("my_page_joined: " + JSON.stringify(data.list));
});
app.get("/api/todolist/show_special", async (req, res) => {
  console.log("show_special: " + JSON.stringify(req.query.userName));

  data.list = await database.run(
    "SELECT id, title, content, createdAt, userName, participants, email, `limit` FROM contents"
  );
  data.userJoinEventsId = await database.run(
    `SELECT id FROM participants_events WHERE userName =?`,
    [req.query.userName]
  );
  //get list data by select sql and put it data.list;
  if (req.cookies && req.cookies.token) {
    data.user = await jwt.verify(req);
    res.send(data);
  }
});

app.get("/api/todolist/show", async (req, res) => {
  data.list = await database.run(
    "SELECT id, title, content, createdAt, userName, participants,email, `limit` FROM contents"
  );
  res.send(data);
});

//hide and show
app.put("/api/todolist", async (req, res) => {
  //find object by id
  const found = await data.list.find((el) => el.id == req.body.id);
  found.isActive = req.body.isActive;
  res.send(data);
});

app.put("/api/todolist/edit/update", async (req, res) => {
  console.log("update: " + JSON.stringify(req.body));
  // Perform the database update here
  // Example using a SQL query with placeholders:
  await database.run(
    "UPDATE contents SET title = ?, content = ?, `limit` = ? WHERE id = ?",
    [req.body.title, req.body.content, req.body.limit, req.body.id],
    (error) => {
      if (error) {
        // Handle the database error here
        console.error(error);
        res.status(500).send("Error updating the item in the database.");
      } else {
        res.send("Item updated successfully.");
      }
    }
  );
});
//----------------------------------------------------------participants----------------------------------------------------------------------

const mailSystem = schedule.scheduleJob("0 0 17 * * *", async () => {
  const userInfoPE = await database.run(
    `SELECT pe.id, u.email, c.title FROM user AS u JOIN participants_events AS pe ON u.userName = pe.userName JOIN contents AS c ON pe.id=c.id`
  ); //참여한 방과 그 사람의 이메일
  const masterContent = await database.run(
    "SELECT email, id, title FROM contents WHERE participants > 1"
  ); //방장 이메일, 방 아이디, 방제목 ,, only participants > 0
  let small = [];
  let middle = new Map();
  let big = new Map();
  for (let i = 0; i < userInfoPE.length; i++) {
    const id = userInfoPE[i].id;
    if (!middle.has(id)) {
      middle.set(id, []);
      small.push(id);
    }
    middle.get(id).push(userInfoPE[i]);
  }

  for (let i = 0; i < masterContent.length; i++) {
    let id = masterContent[i].id;
    let email = masterContent[i].email;
    for (let j = 0; j < middle.size; j++) {
      if (id == middle.get(small[j])[0].id && !big.has(email)) {
        big.set(email, []);
      }
    }
    big.get(email).push(middle.get(small[i]));
  }
  sendMailMaster(big);
});
const tempDBclear = async () => {
  const time = new Date().getTime();
  console.log("tempDBclear in on");
  const listOfTempUser = await database.run(`SELECT * FROM tempuser`);
  for (let el of listOfTempUser) {
    if (time >= el.expiration) {
      await database.run(`DELETE FROM tempuser WHERE crytoToken`, [
        el.crytoToken,
      ]); //해당 데이터 삭제
    }
  }
};
//----------------------------------------------------------mail mail ------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Example app listening on port http://127.0.0.1:${port}`);
});
