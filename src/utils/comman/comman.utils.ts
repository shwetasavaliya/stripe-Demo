import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config";
export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 12);
};

export const jwtTokenGenerate = (data: object) => {
  return jwt.sign(data, SECRET_KEY);
};

export const comparePassword = (password: string, userPassword: string) => {
  return bcrypt.compare(password, userPassword);
};

export const OtpGenerate = () => {
  var digits = "1234567890";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return Number(OTP);
};
