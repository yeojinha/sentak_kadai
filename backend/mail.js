const nodemailer = require("nodemailer");
const MAILS_EMAIL = "sentakuhayeojin@gmail.com";
const MAILS_PASS = "bclmwhsboldzxzop";

const exp = require("constants");
const transporterMinors = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAILS_EMAIL,
    pass: MAILS_PASS,
  },
});
const sendMailMaster = (information) => {
  let mailOptionsMasterList = [];
  const transporterMaster = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: MAILS_EMAIL,
      pass: MAILS_PASS,
    },
  });
  for (let [email, contentList] of information) {
    //map key, value(list)
    for (let content of contentList) {
      let mailOptions = {
        from: "sentakuhayeojin@gmail.com",
        to: email,
        subject:
          "Participant Recruitment and Update on Current Enrollment Status",
        text: "",
        html: `<h3>Title: ${content[0].title}</h3><br>`,
      };

      for (let item of content) {
        let email = item.email;
        let text = `<h4><p>Participant email: ${email}</p></h4><br>`;
        mailOptions.html += text;
      }

      mailOptionsMasterList.push(mailOptions);
    }
  }

  mailOptionsMasterList.forEach((mailOptionsMaster) => {
    transporterMaster.sendMail(mailOptionsMaster, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  });
};

const sendMailMinors = (information) => {
  let minorsList = [];

  for (let info of information) {
    let mailOptions = {
      from: "sentakuhayeojin@gmail.com",
      to: info.email,
      subject: info.title,
      text: info.content,
    };
    minorsList.push(mailOptions);
  }

  minorsList.forEach((mailOptions) => {
    transporterMinors.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  });
};

const newMemberMail = (info) => {
  console.log("Information: " + JSON.stringify(info));

  let mailOptions = {
    from: "sentakuhayeojin@gmail.com",
    to: info.email, //master email
    subject: info.title, // master's room
    html: `<h4><p>Participant email: ${info.content}</p></h4><br>`, // participant's email
  };

  transporterMinors.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

const emailAuth = (email, result, time) => {
  console.log("emailAuth: " + JSON.stringify(email));
  console.log("result: " + JSON.stringify(result));
  let mailOptions = {
    from: "sentakuhayeojin@gmail.com",
    to: email, //master email
    subject: "Verify your email address",
    html: `<p>Please Click the following link to verify your email and Join as a member</p>
    <p> <a href="http://127.0.0.1:3000/api/user/verify-email/?email=${encodeURIComponent(
      email
    )}&token=${encodeURIComponent(result)}"> Verify email</p>
    <p>This link will expire on ${time}.</p>`, // participant's email
  };

  transporterMinors.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = {
  sendMailMaster,
  sendMailMinors,
  newMemberMail,
  emailAuth,
};
