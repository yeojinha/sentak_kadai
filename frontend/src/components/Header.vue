<template>
  <nav class="navbar navbar-default navbar-expand-lg navbar-light">
    <div class="navbar-header">
      <a class="navbar-brand" href="#"
        >U<b>Raaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</b></a
      >
      <button
        type="button"
        data-target="#navbarCollapse"
        data-toggle="collapse"
        class="navbar-toggle"
      >
        <span class="navbar-toggler-icon"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>
    <!-- Collection of nav links, forms, and other content for toggling -->
    <div id="navbarCollapse" class="collapse navbar-collapse">
      <ul id="login_logout" class="nav navbar-nav navbar-right">
        <!-- false면  -->
        <li v-if="!userData.user.checked.login_check">
          <a data-toggle="dropdown" class="dropdown-toggle" href="#">Login</a>
          <ul class="dropdown-menu form-wrapper">
            <li>
              <form>
                <p class="hint-text">Sign in with your social media account</p>
                <div class="form-group social-btn clearfix">
                  <a href="#" class="btn btn-primary pull-left"
                    ><i class="fa fa-facebook"></i> Facebook</a
                  >
                  <a href="#" class="btn btn-info pull-right"
                    ><i class="fa fa-twitter"></i> Twitter</a
                  >
                </div>
                <div class="or-seperator"><b>or</b></div>
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Username"
                    required="required"
                    v-model="userData.user.info.name"
                  />
                </div>
                <div class="form-group">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Password"
                    required="required"
                    v-model="userData.user.info.password"
                  />
                </div>
                <input
                  type="submit"
                  class="btn btn-primary btn-block"
                  value="Login"
                  @click="login()"
                />
                <div class="form-footer">
                  <a href="#">Forgot Your password?</a>
                </div>
              </form>
            </li>
          </ul>
        </li>
        <li v-else>
          <a class="dropdown-toggle" href="#" @click="logout()">Logout</a>
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
                    type="text"
                    class="form-control"
                    placeholder="Email"
                    required="required"
                    v-model="userData.user.info.email"
                  />
                </div>
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Username"
                    required="required"
                    v-model="userData.user.info.name"
                  />
                </div>
                <div class="form-group">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Password"
                    required="required"
                    v-model="userData.user.info.password"
                  />
                </div>
                <div class="form-group">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Confirm Password"
                    required="required"
                    v-model="userData.user.info.confirm_password"
                  />
                </div>
                <div class="form-group">
                  <label class="checkbox-inline"
                    ><input
                      type="checkbox"
                      required="required"
                      v-model="userData.user.checked.accepted"
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
      </ul>
    </div>
  </nav>
</template>
<script>
import { restElement } from "@babel/types";
import axios from "axios";
import { reactive } from "vue";
// import axios from "axios";
export default {
  setup() {
    const userData = reactive({
      userList: [],
      // foundUser
      user: {
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
      },
    });
    const logout = () => {};
    const checked = () => {
      //약관동의
      userData.user.checked.accepted = true; //false -> true;
    };
    //reset 약관동의 false, login_check-> false로 하여 v-if display 표시 유무
    const reset = (userData) => {
      userData.user.checked.accepted = false; //
      for (let i in userData.user) {
        userData.user.info[i] = "";
      }
      for (let i in userData.checked) {
        userData.user.checked[i] = false;
      }
    };
    //reset
    //signIn
    const login = () => {
      const data = {
        name: userData.user.info.name,
        password: userData.user.info.password,
      };
      console.log("login user: " + JSON.stringify(data));

      //서버측에 해당 data있는지 check * 현재 login 쪽에서 문제가 생김 수정해야 함
      axios.post("/api/todolist/login", data).then((res) => {
        console.log("get found id: " + JSON.stringify(res.data));
        if (res.data === undefined || res.data === "") {
          alert("아이디 혹은 비밀번호 오류입니다.");
          reset(userData);
          return;
        }
        userData.user = res.data;
        userData.user.checked.login_check = true;
        console.log(JSON.stringify(res.data));
      });
      //데이터 없으면, 서버측에서 handle

      //데이터 있으면 화면표시 username으로 변경하기.
    };
    //signIn
    //signUp
    const signUp = () => {
      //jwt 토큰으로 자동 login 진행
      console.log("first accepted check: " + userData.user.checked.accepted);
      for (let i in userData.user) {
        if (userData.user.info[i] === "") {
          console.log(`userData.user[${i}]: ${userData.user.info[i]}`);
          alert("입력해주세요.");
          reset(userData);
          return;
        }
      }
      if (userData.user.info.password !== userData.user.info.confirm_password) {
        // reset(userData);
        alert("암호가 일치하지 않습니다.");
        return;
      }
      if (userData.user.checked.accepted === false) {
        alert("약관 동의를 해주세요.");
        // reset(userData);
        return;
      }

      const user = userData.user;

      axios
        .post("/api/todolist/signup", user)
        .then((res) => {
          console.log("singUp: " + res.data);
          userData.userList = res.data;
          reset(userData);

          console.log(
            "lastt accepted check: " + userData.user.checked.accepted
          );
        })
        .catch((err) => {
          console.log(err);
        });
    };
    //signUp
    return { userData, signUp, checked, reset, login, logout };
  },
};

// Prevent dropdown menu from closing when click inside the form
$(document).on("click", ".navbar-right .dropdown-menu", function (e) {
  e.stopPropagation();
});
</script>

<style>
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
.navbar .nav .btn-primary,
.navbar .nav .btn-primary:active {
  color: #fff;
  background: #33cabb;
  padding-top: 8px;
  padding-bottom: 6px;
  vertical-align: middle;
  border: none;
}
.navbar .nav .btn-primary:hover,
.navbar .nav .btn-primary:focus {
  color: #fff;
  outline: none;
  background: #31bfb1;
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
