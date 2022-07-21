import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { Req, Res } from "routing-controllers";
import { NextFunction } from "express";
export class Auth {
  use(@Req() request: any, @Res() response: any, next: NextFunction) {
    
    try {
      const token = request.headers["authorization"];
      if(!token) return response.status(401).send({
        status:false,
        error:{
          code:"AUTH-001",
          message:"Please Provide Authorize Token"
        }
      });
      const verifyToken = jwt.verify(token, SECRET_KEY);
      request.data = verifyToken;
      next();
    } catch (error: any) {
      console.log("Error  ::::  "  , error);
      response.status(401).json({
        error: error.message ? error.message : error,
      });
    }
  }
}
