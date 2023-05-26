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
/**
 * 0. 유저 로그인 상태, 클릭 시
 * 1. 현재 클릭한 이벤트 대상 targetItem에 대입
 * 2. 체크(유저 로그인상태인가?) true 3으로 false -> return
 * 3. axios.put(현재 유저name 현재 targetEventId) -> participant_events에서 현 userName, 현 eventId  있는지 가져오기
 * 4. Server Side -> sql로 if(event id && userName in participants_events) -> if(found) true(존재)
 * 4-1. app.delete(현재 유저정보, 이벤트id) -> participants_events에서 해당하는 data 삭제
 * 4-2. app.put(event id)-> contents 에서 participants -1하기
 * 4-2. 현 아이템 state.list[now].hasJoined=false;
 * 5. if(현재 유저가 신규 유저가 될 것이라면) -> if(found.length<0)
 * 5-1. app.put(현재 유저정보, 이벤트id) -> participants_events에서 data 추가
 * 5-2. app.put(content id)-> contents에서 participants +1하기
 * 5-3. 현재 유저가 참여중인 이벤트 id를 res.send하여 front에서 for loop 활용->  만약 서버에서 받은 id가 있다면 ->state.list[i].hasJoined=true;
 */

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
  if (numberOfPart[0].participants > 0) {
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
    console.log("temp is not in this evnet");
    //new participant
    //이벤트에 신규 참여할 유저
    numberOf++;

    console.log("Not in the event numberOfPar check: " + numberOf);
    await database.run(
      `INSERT INTO participants_events (userName, id) VALUES(?,?)`,
      [req.body.name, req.body.id]
    ); //데이터 다대다 테이블에 추가
    await database.run(
      `INSERT INTO participants_events_history (userName, id) VALUES(?,?)`,
      [req.body.name, req.body.id]
    );
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
    eventsList: await database.run(`SELECT * FROM contents WHERE userName `),
  };

  console.log(
    "bakc index.js data userJoinEventsId : " +
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
  res.send(data); // sending the eventsId current user joined + eventsList;
});
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
  console.log("foundUser.userName: " + JSON.stringify(foundUser[0]));

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

          foundJoinEventsId: await database.run(
            "SELECT id FROM participants_events WHERE userName = ?",
            [foundUser[0].userName]
          ),
        },
      },
      jwtKey,
      {
        expiresIn: "15m",
        issuer: "yeojin",
      }
    );

    res.cookie("token", token); //set cookie browser
    //login true
    // await loginSetTrue(foundUser);
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
  let list = await database.run("SELECT * FROM contents");
  const already_join = await database.run(
    "SELECT * FROM participants_events WHERE id = ? AND userName =?",
    [req.body.data.id, req.body.data.name]
  );
  if (already_join.length > 0) console.log("already exist");
  else if (already_join.length <= 0) {
    console.log("req.body.data.name: " + req.body.data.name);
    await database.run(`UPDATE contents SET participants = ? WHERE id = ?`, [
      //현재 참여 인원 수정
      req.body.data.num,
      req.body.data.id,
    ]);

    await database.run(
      `INSERT INTO participants_events (userName, id) VALUES(?,?)`,
      [req.body.data.name, req.body.data.id]
    );
    await database.run(
      `INSERT INTO participants_events_history (userName, id) VALUES(?,?)`,
      [req.body.data.name, req.body.data.id]
    );
  }
  list = await database.run("SELECT * FROM contents");
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

    await database.run(`DELETE FROM contents WHERE id=?`, [targetContent.id]);
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
    data.list = await database.run("SELECT * FROM contents");
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
    `INSERT INTO contents(id, title, content, createdAt, userName,participants, \`limit\`) VALUES(?,?,?,?,?,?,?)`,
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
  const list = await database.run(`SELECT * FROM contents`); //array returns
  console.log("add list :" + list);

  //change to sql -> get data by select sql
  res.send(list);
});

//list show
app.get("/api/todolist/show", async (req, res) => {
  data.list = await database.run("SELECT * FROM contents");

  //get list data by select sql and put it data.list;
  if (req.cookies && req.cookies.token) {
    jwt.verify(req.cookies.token, jwtKey, (err, decoded) => {
      if (err) {
        console.log("list show " + err);
      }
      data.user = decoded;
      console.log("cookies data : " + JSON.stringify(data));
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
