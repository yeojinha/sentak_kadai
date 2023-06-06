<template>
  <nav class="navbar navbar-default navbar-expand-lg navbar-light">
    <div class="navbar-header">
      <a
        class="navbar-brand"
        href="#"
        style="background-color: gray"
        @click="home()"
      >
        Main &nbsp &nbsp &nbsp &nbsp<b>HomePage</b></a
      >
    </div>
    <div id="navbarCollapse" class="collapse navbar-collapse">
      <ul id="login_logout" class="nav navbar-nav navbar-right">
        <li v-if="!userData.user.checked.login_check">
          <a data-toggle="dropdown" class="dropdown-toggle" href="#">Sign In</a>
          <ul class="dropdown-menu form-wrapper">
            <li>
              <form>
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Username"
                    required="required"
                    v-model="userData.formUser.info.name"
                  />
                </div>
                <div class="form-group">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Password"
                    required="required"
                    v-model="userData.formUser.info.password"
                  />
                </div>
                <input
                  type="submit"
                  class="btn btn-primary btn-block"
                  value="Login"
                  @click.prevent="login()"
                />
                <div class="form-footer">
                  <a href="#">Forgot Your password?</a>
                </div>
              </form>
            </li>
          </ul>
        </li>
        <li v-else>
          <router-link
            tag="button"
            class="btn btn-primary btn-block"
            to="/mypage"
            @click="my_page()"
          >
            {{ userData.user.info.name }}
          </router-link>
        </li>
        <!-- false면 -->
        <li v-if="!userData.user.checked.login_check">
          <a
            href="#"
            data-toggle="dropdown"
            class="btn btn-primary dropdown-toggle get-started-btn mt-1 mb-1"
            >Sign up</a
          >
          <!-- sign up form -->
          <ul class="dropdown-menu form-wrapper">
            <li>
              <form>
                <p class="hint-text">
                  Fill in this form to create your account!
                </p>
                <div class="form-group">
                  <input
                    type="email"
                    class="form-control"
                    placeholder="Email"
                    required="required"
                    v-model="userData.formUser.info.email"
                  />
                </div>
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Username"
                    required="required"
                    v-model="userData.formUser.info.name"
                  />
                </div>
                <div class="form-group">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Password"
                    required="required"
                    v-model="userData.formUser.info.password"
                  />
                </div>
                <div class="form-group">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Confirm Password"
                    required="required"
                    v-model="userData.formUser.info.confirm_password"
                  />
                </div>
                <div class="form-group">
                  <label class="checkbox-inline"
                    ><input
                      type="checkbox"
                      required="required"
                      v-model="userData.formUser.checked.accepted"
                      @click="checked()"
                    />
                    I accept the <a href="#">Terms &amp; Conditions</a></label
                  >
                </div>
                <input
                  type="submit"
                  class="btn btn-primary btn-block"
                  value="Sign up"
                  @click="signUp()"
                />
              </form>
            </li>
          </ul>
        </li>
        <li v-else>
          <a class="btn btn-primary btn-block" @click="logout()"> Logout </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

import { reactive } from "vue";
export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    let userData = reactive({
      reg: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      formUser: {
        info: {
          password: "",
          confirm_password: "",
          name: "",
          email: "",
        },
        checked: {
          accepted: false,
          login_check: false,
        },
        foundEventsId: [],
      },
      user: {
        info: {
          password: "",
          confirm_password: "",
          name: route.query.userName || "",
          email: route.query.email || "",
        },
        checked: {
          accepted: route.query.accepted || false,
          login_check: route.query.login_check || false,
        },
        foundEventsId: [],
      },
    });
    const isEmailValid = (email) => {
      return email == "" ? "" : userData.reg.test(email) ? true : false;
    };
    const home = () => {
      router.push({
        name: "Home",
        userName: userData.user.info.name,
        email: userData.user.info.email,
        accepted: userData.user.checked.accepted,
        login_check: userData.user.checked.login_check,
      });
    };

    const my_page = () => {
      router.push({
        name: "MyPage",
        query: {
          accepted: userData.user.checked.accepted,
          login_check: userData.user.checked.login_check,
        },
      });
    };
    const userSet = (res) => {
      console.log("res.data.login_check: " + JSON.stringify(res.data));
      if (res.data.userName) {
        userData.user.info.name = res.data.userName;
        userData.user.info.email = res.data.email;
        userData.user.checked.accepted = res.data.accepted;
        userData.user.checked.login_check = true;
      }
      // userData.user.info.password = res.data.user.info.password;
    };
    /////////////////////////reset user data //////////////////////////////
    const reset = (user) => {
      user.checked.accepted = false; //
      for (let i in user.info) {
        user.info[i] = "";
      }
      for (let i in user.checked) {
        user.checked[i] = false;
      }
    };
    const empty = () => {
      userData.user.checked.accepted = false; //
      for (let i in userData.user.info) {
        userData.user.info[i] = "";
      }
      for (let i in userData.user.checked) {
        userData.user.checked[i] = false;
      }
      userData.user.foundEventsId = [];
    };
    const printCurrentUser = () => {
      console.log("current user check: " + JSON.stringify(userData.user));
    };
    /////////////////////-------------------------//////////////////////////

    //user token check
    axios.get("/api/user").then(async (res) => {
      console.log("front user api/user: " + JSON.stringify(userData.user));
      console.log("front user token check: " + JSON.stringify(res.data));
      if (res.data && res.data.user) {
        userData.user.info = res.data.user.info;
        userData.user.checked = res.data.user.checked;
        console.log(
          "inside front user token check: " + JSON.stringify(userData.user)
        );
      } else {
        console.log("no login now");
        userData.user.info = {};
        userData.user.checked = {};
      }
    });

    //logout
    const logout = () => {
      const logoutUser = {
        name: userData.user.info.name,
        password: userData.user.info.password,
      };
      console.log("logout check: " + JSON.stringify(logoutUser));
      axios.delete("/api/user/logout", { data: logoutUser }).then((res) => {
        empty();
        printCurrentUser();

        window.location.reload(); //refresh cuz button doesn't refresh itself
      });
    };
    const checked = () => {
      userData.user.checked.accepted = true; //false -> true;
    };

    //reset
    //logIn
    const login = () => {
      const loginUser = {
        name: userData.formUser.info.name,
        password: userData.formUser.info.password,
      };
      console.log("login user: " + JSON.stringify(loginUser));
      //front side check above
      axios.post("/api/user/login", loginUser).then(async (res) => {
        console.log(
          "login  foundJoinEventsId check: " + JSON.stringify(res.data)
        );
        if (!res.data === undefined || res.data === "") {
          // if undefined or no user found checking
          alert("id or password error.");
          reset(userData.formUser);
          return;
        } else if (res.data === "login") {
          alert("user already login!!!");
          return;
        }
        // alert("res on login: "+JSON.stringify(res.token))
        //found user
        console.log("login->>>>>>>>>>>>>>>>" + JSON.stringify(res.data));
        await userSet(res);
        console.log(
          "userData user in userSet login: " + JSON.stringify(userData.user)
        );
        window.location.reload();
      });
    };
    //logIn
    //signUp
    const signUp = () => {
      console.log(
        "first accepted check: " + userData.formUser.checked.accepted
      );
      //check
      for (let i in userData.formUser) {
        if (userData.formUser.info[i] === "") {
          console.log(`userData.user[${i}]: ${userData.formUser.info[i]}`);
          reset(userData.formUser);
          return;
        }
      }
      if (!isEmailValid(userData.formUser.info.email)) {
        alert("Wrong Email");
        return;
      }
      if (
        userData.formUser.info.password !==
        userData.formUser.info.confirm_password
      ) {
        // reset(userData);
        alert("Wrong password");
        return;
      }
      if (userData.formUser.checked.accepted === false) {
        // reset(userData);
        return;
      }
      //check

      const user = userData.formUser;

      axios.post("/api/user/signup", user).then(async (res) => {
        console.log("singUp: " + JSON.stringify(res.data));
        //singUp: [{"userName":"yaya","email":"yaya","password":"yaya","login_check":"false","accepted":"true"}]
        if (!res.data) {
          //if no res data
          alert("The ID already exists.");
          return;
        } else {
          alert("가입성공");
          reset(userData.formUser);
        }
      });
    };

    return {
      userData,
      signUp,
      checked,
      reset,
      login,
      logout,
      empty,
      router,
      printCurrentUser,
      userSet,
      my_page,
      home,
    };
  },
};

// Prevent dropdown menu from closing when click inside the form
$(document).on("click", ".navbar-right .dropdown-menu", function (e) {
  e.stopPropagation();
});
</script>

<style>
#login_ing {
  display: flex-end;
}
.form-control {
  box-shadow: none;
  font-weight: normal;
  font-size: 13px;
}
.form-control:focus {
  border-color: #33cabb;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}
.collapse {
  display: flex;
  justify-content: right;
}
.navbar {
  background: #fff;
  padding-left: 16px;
  padding-right: 16px;
  border-bottom: 1px solid #dfe3e8;
  border-radius: 0;
}
.nav img {
  border-radius: 50%;
  width: 36px;
  height: 36px;
  margin: -8px 0;
  float: left;
  margin-right: 10px;
}
.navbar .navbar-brand,
.navbar .navbar-brand:hover,
.navbar .navbar-brand:focus {
  padding-left: 0;
  font-size: 20px;
  padding-right: 50px;
}
.navbar .navbar-brand b {
  font-weight: bold;
  color: #33cabb;
}
.navbar .form-inline {
  display: inline-block;
}
.navbar .nav li {
  position: relative;
}
.navbar .nav li a {
  color: #888;
}
.search-box {
  position: relative;
}
.search-box input {
  padding-right: 35px;
  border-color: #dfe3e8;
  border-radius: 4px !important;
  box-shadow: none;
}
.search-box .input-group-addon {
  min-width: 35px;
  border: none;
  background: transparent;
  position: absolute;
  right: 0;
  z-index: 9;
  padding: 7px;
  height: 100%;
}
.search-box i {
  color: #a0a5b1;
  font-size: 19px;
}
#my_page {
  background: #4346e0;
}

.navbar .nav .btn-primary,
.navbar .nav .btn-primary:active {
  color: #fff;
  background: #4577e4;
  padding-top: 8px;
  padding-bottom: 6px;
  padding-left: 10px;
  vertical-align: middle;
  border: none;
}
.navbar .nav .btn-primary:hover,
.navbar .nav .btn-primary:focus {
  color: #fff;
  outline: none;
  padding-left: 10px;
  background: #4577e4;
}
.navbar .navbar-right li:first-child a {
  padding-right: 30px;
}
.navbar ul li i {
  font-size: 18px;
}
.navbar .dropdown-menu i {
  font-size: 16px;
  min-width: 22px;
}
.navbar ul.nav li.active a,
.navbar ul.nav li.open > a {
  background: transparent !important;
}
.navbar .nav .get-started-btn {
  min-width: 120px;
  margin-top: 8px;
  margin-bottom: 8px;
}
.navbar ul.nav li.open > a.get-started-btn {
  color: #fff;
  background: #31bfb1 !important;
}
.navbar .dropdown-menu {
  border-radius: 1px;
  border-color: #e5e5e5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.navbar .nav .dropdown-menu li {
  color: #999;
  font-weight: normal;
}
.navbar .nav .dropdown-menu li a,
.navbar .nav .dropdown-menu li a:hover,
.navbar .nav .dropdown-menu li a:focus {
  padding: 8px 20px;
  line-height: normal;
}
.navbar .navbar-form {
  border: none;
}
.navbar .dropdown-menu.form-wrapper {
  width: 280px;
  padding: 20px;
  left: auto;
  right: 0;
  font-size: 14px;
}
.navbar .dropdown-menu.form-wrapper a {
  color: #33cabb;
  padding: 0 !important;
}
.navbar .dropdown-menu.form-wrapper a:hover {
  text-decoration: underline;
}
.navbar .form-wrapper .hint-text {
  text-align: center;
  margin-bottom: 15px;
  font-size: 13px;
}
.navbar .form-wrapper .social-btn .btn,
.navbar .form-wrapper .social-btn .btn:hover {
  color: #fff;
  margin: 0;
  padding: 0 !important;
  font-size: 13px;
  border: none;
  transition: all 0.4s;
  text-align: center;
  line-height: 34px;
  width: 47%;
  text-decoration: none;
}
.navbar .social-btn .btn-primary {
  background: #507cc0;
}
.navbar .social-btn .btn-primary:hover {
  background: #4676bd;
}
.navbar .social-btn .btn-info {
  background: #64ccf1;
}
.navbar .social-btn .btn-info:hover {
  background: #4ec7ef;
}
.navbar .social-btn .btn i {
  margin-right: 5px;
  font-size: 16px;
  position: relative;
  top: 2px;
}
.navbar .form-wrapper .form-footer {
  text-align: center;
  padding-top: 10px;
  font-size: 13px;
}
.navbar .form-wrapper .form-footer a:hover {
  text-decoration: underline;
}
.navbar .form-wrapper .checkbox-inline input {
  margin-top: 3px;
}
.or-seperator {
  margin-top: 32px;
  text-align: center;
  border-top: 1px solid #e0e0e0;
}
.or-seperator b {
  color: #666;
  padding: 0 8px;
  width: 30px;
  height: 30px;
  font-size: 13px;
  text-align: center;
  line-height: 26px;
  background: #fff;
  display: inline-block;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  position: relative;
  top: -15px;
  z-index: 1;
}
.navbar .checkbox-inline {
  font-size: 13px;
}
.navbar .navbar-right .dropdown-toggle::after {
  display: none;
}
@media (min-width: 1200px) {
  .form-inline .input-group {
    width: 300px;
    margin-left: 30px;
  }
}
@media (max-width: 768px) {
  .navbar .dropdown-menu.form-wrapper {
    width: 100%;
    padding: 10px 15px;
    background: transparent;
    border: none;
  }
  .navbar .form-inline {
    display: block;
  }
  .navbar .input-group {
    width: 100%;
  }
  .navbar .nav .btn-primary,
  .navbar .nav .btn-primary:active {
    display: block;
  }
}
</style>
