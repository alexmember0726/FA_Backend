import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const signUpUserData: User = await this.auth.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const { cookie, findUser, token } = await this.auth.login(userData);
      //var token = jwt.sign({ id: findUser.id }, SECRET_KEY);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, message: 'login', token });
    } catch (error) {
      next(error);
    }
  };
  
  
  public getLoggedInUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cookie, findUser, token } = await this.auth.getLoggedInUser(req);
      //var token = jwt.sign({ id: findUser.id }, SECRET_KEY);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, message: 'login', token });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.auth.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public verifyAccount = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      const rowCount = await this.auth.verifyAccount(email);

      res.status(200).json({ data: rowCount, message: 'verified' });
    } catch (error) {
      next(error);
    }
  };


  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      const rowCount = await this.auth.forgotPassword(email);

      res.status(200).json({ data: rowCount, message: 'forgotPassword' });
    } catch (error) {
      next(error);
    }
  };
}
