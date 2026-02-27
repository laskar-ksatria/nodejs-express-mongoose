import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.model";
import { comparePassword } from "../lib/utils";
import { IAuthRequest, IUserDocument } from "../types";
import HttpError, { errorStates } from "../errors";
import { GenerateToken } from "../services/jwt";

class UserController {
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, full_name, password } = req.body;
      const user = (await UserModel.create({
        email,
        full_name,
        password,
      })) as IUserDocument;
      const access_token = GenerateToken({ id: user._id });
      return res.status(201).json({
        success: true,
        data: {
          data: {
            access_token,
            user: {
              _id: user._id,
              full_name: user.full_name,
              email: user.email,
            },
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = (await UserModel.findOne({ email })) as IUserDocument;
      if (!user) throw new HttpError(errorStates.invalidEmailOrPassword);
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new HttpError(errorStates.invalidEmailOrPassword);
      }
      const access_token = GenerateToken({ id: user._id });
      const { password: _password, ...safeUser } = user.toObject();
      return res.status(200).json({
        success: true,
        data: {
          user: safeUser,
          access_token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req?.decoded?.id;
      if (!userId) throw new HttpError(errorStates.failedAuthentication);
      const user = await UserModel.findById(userId);

      if (!user) throw new HttpError(errorStates.failedAuthentication);

      const { password: _password, ...safeUser } = user.toObject();

      return res.status(200).json({
        success: true,
        data: { user: safeUser },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default UserController;
