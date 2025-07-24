const nodemailer = require("nodemailer");

class Services {
  sendEmail = (user, assignment, type) => {
    const transporter = nodemailer.createTransport({
      service: process.env.SEND_EMAIL_SERVICE_NAME,
      secure: true,
      port: process.env.SEND_EMAIL_SERVICE_PORT,
      auth: {
        user: process.env.SEND_EMAIL_WEBSITE_AUTH_USERNAME,
        pass: process.env.SEND_EMAIL_WEBSITE_AUTH_PASS,
      },
    });

    const mailOptions = {
      from: "nida.waheed@visnext.net",
      to: "nidawaheed506@gmail.com",
      subject:
        type === "project"
          ? `${user.name} - Your Project Assignment`
          : `${user.name} - Your Bug Assignment`,
      text:
        type === "project"
          ? `Hi ${user.name}, You are assigned to a project :  ${assignment.projectName}`
          : `Hi ${user.name}, You are assigned to a bug : ${assignment.title}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  };
}

const services = new Services();

module.exports = { services };
