# sentak_kadai

# cd ./frontend -> npm run serve

# using axios to connect server side at front side vue

# cd ./backend -> nodemon index.js

# database mariadb

# added -> npm install --save mitt





자동로그인 동작 시나리오
1. 로그인하면 access token과 refresh token을 생성해 둘 다 발급해준다. 이 때, refresh token은 db에 저장한다.

2. 클라이언트에서 요청을 보낼때 마다 access token을 담아 서버에 요청한다.

3.a

  1. 만료된 토큰을 담아 요청하면, 서버에서 401 응답을 보낸다.

  2. 401 응답을 받은 클라이언트는 access token과 refresh token을 같이 보낸다.

3.b 클라이언트에서 access token의 payload를 통해 만료기간이 지났다는 것을 확인해 바로 refresh 요청을 보낸다. (이렇게 하면 네트워크 요청을 줄일 수 있다.)

4. refresh 요청을 받은 서버는 만료된 access token을 통해 회원 정보를 뽑아내고, 그 정보와 매치되는 refresh token을 db에서 가져온다.

5.  가져온 refresh token을 클라이언트로부터 받은 refresh token과 일치하는지 확인한다.

6.a. 일치한다면, 새로운 access token을 발급해준다.

6.b. 일치하지 않는다면, refresh token이 유효하지 않은 것이니 401 응답을 보내고 클라이언트는 재 로그인을 하게된다.

 

refresh token이 만료되었다면 해당 refresh token을 db에서 제거하고 401 응답을 보내 재 로그인 하도록 한다.



https://donologue.tistory.com/397

https://cotak.tistory.com/102


middleware to verify access token.







const newMemberMail = (information) =>{
  let transporterMinors = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: MAILS_EMAIL,
      pass: MAILS_PASS,
    },
  });

  let mailOptions = {
    from: "sentakuhayeojin@gmail.com",
    to: information.email,//master email
    subject: info.title, // matster's room
    text: info.content,// participant's email
  };

  transporterMinors.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });


}

module.exports = { sendMailMaster, sendMailMinors,newMemberMail };
