import {
  Body,
  Get,
  JsonController,
  Post,
  Put,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import UserService from "./user.service";
import { UserDTO, UserEmailDTO } from "./user.validator";
import {
  hashPassword,
  jwtTokenGenerate,
  comparePassword,
} from "../../utils/comman/comman.utils";

@JsonController("/user")
export default class UserController {
  private userService: UserService = new UserService();

  @Post("/create", { transformResponse: true })
  async register(
    @Req() request: any,
    @Res() response: any,
    @Body({ validate: true }) body: UserDTO
  ) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        address,
        phoneNo,
        userImage,
        role,
      } = body;

      const userExists = await this.userService.findOne({ email });
      if (userExists)
        return response.formatter.error({}, false, "USER_ALREADY_EXISTS");
      const hashedPassword = await hashPassword(password);

      const userData: any = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        address,
        phoneNo,
        userImage,
        role,
      };

      const userCreate: any = await this.userService.create(userData);
      const id = userCreate._id;

      const jwtToken = jwtTokenGenerate({
        id,
        firstName,
        lastName,
        role,
      });

      return response.formatter.ok(
        { ...userData, jwtToken },
        true,
        "USER_REGISTER_SUCCESS"
      );
    } catch (error) {
      console.log("ERR:: ", error);
      return response.formatter.error({}, false, "USER_REGISTER_FAILED", error);
    }
  }

  @Post("/login")
  async login(
    @Req() request: any,
    @Res() response: any,
    @Body({ validate: true }) body: UserEmailDTO
  ) {
    try {
      const { email, password } = body;
      const userEmail: any = await this.userService.findOne({ email });
      if (!userEmail)
        return response.formatter.error({}, false, "USER_EMAIL_IS_NOT_A_MATCH");
      const matchPassword = await comparePassword(password, userEmail.password);
      if (matchPassword == false)
        return response.formatter.error(
          {},
          false,
          "USER_PASSWORD_IS_NOT_A_MATCH"
        );
      const jwtToken = jwtTokenGenerate({
        id: userEmail._id,
        firstName: userEmail.firstName,
        lastName: userEmail.lastName,
        role: userEmail.role,
      });
      return response.formatter.ok(
        { ...userEmail, jwtToken },
        true,
        "USER_LOGIN_SUCCESS"
      );
    } catch (error) {
      console.log("ERR::", error);
      return response.formatter.error({}, false, "USER_LOGIN_FAILED", error);
    }
  }
}
