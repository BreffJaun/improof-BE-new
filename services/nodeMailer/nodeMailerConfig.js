// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import "dotenv/config";
import nodemailer from "nodemailer";

// I M P O R T:  E N V  O P T I O N S
import { SENDER_MAIL, SENDER_PASS } from "../../config/config.js";
import { MAIL_SUBJECT, generateMailHtml } from "./nodeMailerContent.js";

// I M P O R T:   S E R V I C E S
import { createVerifyToken } from "../jwt/jwt.js";

//========================

// C O N F I G U R A T I O N
const transporter = nodemailer.createTransport({
  host: "smtp.ionos.de",
  port: 587,
  secure: false,
  auth: {
    user: SENDER_MAIL,
    pass: SENDER_PASS,
  },
  tls: {
    minVersion: "TLSv1.2",
  },
});

const mailOptions = (user, kof) => {
  // kof => "kind of function"
  const options = {
    from: SENDER_MAIL,
    to: `${user.profile.email}`,
    subject: MAIL_SUBJECT,
    html: generateMailHtml(user, createVerifyToken(user), kof),
  };
  return options;
};

export const sendMail = async (user, kof) => {
  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions(user, kof), function (error, info) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Email sent: " + info.response);
          resolve();
        }
      });
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

// SETTINGS FOR GMAIL
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: SENDER_MAIL,
//     pass: GMAIL_APP_PASS,
//   },
// });
