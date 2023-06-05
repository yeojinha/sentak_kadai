const nodemailer = require("nodemailer");
const MAILS_EMAIL = "sentakuhayeojin@gmail.com";
const MAILS_PASS = "bclmwhsboldzxzop";
const sendMailMaster = (information) => {
  let transporterMaster = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: MAILS_EMAIL,
      pass: MAILS_PASS,
    },
  });

  let mailOptionsMasterList = [];

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
  let transporterMinors = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: MAILS_EMAIL,
      pass: MAILS_PASS,
    },
  });

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

const newMemberMail = (information) => {
  let transporterMinors = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: MAILS_EMAIL,
      pass: MAILS_PASS,
    },
  });

  let mailOptions = {
    from: "sentakuhayeojin@gmail.com",
    to: information.email, //master email
    subject: info.title, // matster's room
    text: info.content, // participant's email
  };

  transporterMinors.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = { sendMailMaster, sendMailMinors, newMemberMail };
// const sendMailMaster = (information) => {
//   let transporterMaster = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: MAILS_EMAIL,
//       pass: MAILS_PASS,
//     },
//   });
//   let mailOptionsMasterList = [];
//   let user = {
//     emailToSend: "",
//     html: "",
//   };
//   for (let i = 0; i < information.size; i++) {
//     let mapArr = Array.from(information);
//     console.log(`${i}: ` + mapArr[i][0]);
//     user.emailToSend = mapArr[i][0]; //good
//     console.log("user email TO Send : " + user.emailToSend);

//     for (let j = 0; j < information.get(user.emailToSend).length; j++) {
//       let mailOptions = {
//         from: "hayeojin4966@gmail.com",
//         to: "",
//         subject:
//           "Participant Recruitment and Update on Current Enrollment Status",
//         text: "",
//         html: `<h3>Title: ${
//           information.get(user.emailToSend)[j][0].title
//         }</h3><br>`,
//       };
//       // console.log(
//       //   "information.get(user.emailToSend)[j][0].title: " +
//       //     JSON.stringify(information.get(user.emailToSend)[j][0].title)
//       // );
//       // console.log(
//       //   "information.get(user.emailToSend)[j][1].title: " +
//       //     JSON.stringify(information.get(user.emailToSend)[j][1].title)
//       // );
//       for (let w = 0; w < information.get(user.emailToSend)[j].length; w++) {
//         // let id = information.get(user.emailToSend)[j][w].id;
//         // console.log(
//         //   "information.get(user.emailToSend)[j][w]: " +
//         //     JSON.stringify(information.get(user.emailToSend)[j][w])
//         // );
//         let email = information.get(user.emailToSend)[j][w].email;
//         let text = `<h4><p>email: ${email}</p></h4><br>`;
//         user.html += text;
//       }
//       mailOptions.to = user.emailToSend;
//       mailOptions.html += user.html;
//       (user.html = ""), mailOptionsMasterList.push(mailOptions);
//     }
//     // mailOptionsMasterList.forEach((el) => {
//     //   console.log("마지막 테스트: " + JSON.stringify(el));
//     // });
//   }

//   // console.log("mailOptionMasterList: " + JSON.stringify(mailOptionsMasterList));

//   mailOptionsMasterList.forEach((mailOptionsMaster) => {
//     console.log("mailOption => " + JSON.stringify(mailOptionsMaster));
//     transporterMaster.sendMail(mailOptionsMaster, function (err, info) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(info);
//       }
//     });
//   });
// };

// const sendMailMinors = (information) => {
//   let transporterMinors = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: MAILS_EMAIL,
//       pass: MAILS_PASS,
//     },
//   });

//   let minorsList = [];
//   let mailOptions = null;
//   for (let i = 0; i < information.length; i++) {
//     mailOptions = {
//       from: "sentakuhayeojin@gmail.com",
//       to: information[i].email,
//       subject: information[i].title,
//       text: information[i].content,
//     };
//     minorsList.push(mailOptions);
//   }

//   minorsList.forEach((el) => {
//     transporterMinors.sendMail(el, function (err, info) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(info);
//       }
//     });
//   });
// };

// module.exports = { sendMailMaster, sendMailMinors };
