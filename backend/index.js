const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

const index_data = ["All", "모집", "마감"];
const list = [];
const userList = [];
app.use(express.json());
//가입
app.post("/api/todolist/signup", async (req, res) => {
  console.log("-----------");
  const userData = req.body;
  await userList.push(userData);

  console.log(userList);
  res.send(userList);
});
// Login Logout
//Login_1
app.post("/api/todolist/login", async (req, res) => {
  const user = req.body;
  console.log("back username: " + user.name);
  console.log("back password: " + user.password);

  const foundUser = await userList.find(
    (el) => el.info.name == user.name && el.info.password == user.password
  );
  console.log("found User: " + JSON.stringify(foundUser));
  res.send(foundUser);
});
//
//delete
app.delete("/api/todolist", async (req, res) => {
  try {
    console.log("original List: " + JSON.stringify(list));
    console.log("req.id: " + req.query.id);

    const idx = await list.findIndex((el) => el.id == req.query.id); //find index by element id;

    if (idx !== -1) {
      //if no element idx is -1 else idx
      list.splice(idx, 1); //delete from idx, one object
    }
    console.log("deleted List: " + JSON.stringify(list));
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//add
app.post("/api/todolist", async (req, res) => {
  const formData = req.body;
  await list.push(formData);
  list.forEach((element) => {
    console.log("el.id: " + element.id);
  });
  res.send(list);
});

//list show
app.get("/api/todolist", (req, res) => {
  res.send(list);
});

//hide and show
app.put("/api/todolist", async (req, res) => {
  //find object by id
  const found = await list.find((el) => el.id == req.body.id);
  found.isActive = req.body.isActive;
  res.send(list);
});

app.listen(port, () => {
  console.log(`Example app listening on port http://127.0.0.1:${port}`);
});
