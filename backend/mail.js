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

const newMemberMail = (info) => {
  console.log("Information: " + JSON.stringify(info));
  let transporterMinors = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: MAILS_EMAIL,
      pass: MAILS_PASS,
    },
  });

  let mailOptions = {
    from: "sentakuhayeojin@gmail.com",
    to: info.email, //master email
    subject: info.title, // master's room
    text: `<h4><p>Participant email: ${info.content}</p></h4><br>`, // participant's email
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
