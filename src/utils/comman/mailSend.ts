import nodeMailer from "nodemailer";
import { Redirect } from "routing-controllers";
import ejs from 'ejs';
import path from 'path';

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: "julleegorasiya.realloc@gmail.com",
    pass: "cpigqyphvfbzatws",
  },
});

export const sendMail = (email: String, otp: String) => {
  const mailOptions: any = {
    from: "julleegorasiya.realloc@gmail.com",
    to: email,
    subject: "Send OTP",
    text: `OTP: ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
};

export const userJoinMailSend = async (email:String,token:String) => {
  const pathName = path.join(__dirname, '../../../src/views/layout.ejs'); 
  const data = await ejs.renderFile(pathName,{data:token});
  const mailOptions: any = {
    from: "julleegorasiya.realloc@gmail.com",
    to: email,
    subject: "Invite User",
    html:data
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
};
