import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { sendEmail } from '@/utils/mail';

export class UserController {
  public user = Container.get(UserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.user.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const findOneUserData: User = await this.user.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const createUserData: User = await this.user.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData: User = req.body;
      const updateUserData: User[] = await this.user.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const deleteUserData: User[] = await this.user.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };


  public saveUserRating = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const {receiver_id, title, description, rating} = req.body;
      const propertyRating = await this.user.saveUserRating(userData.id, receiver_id, title, description, rating);

      res.status(201).json({ data: propertyRating, message: 'created' });
    } catch (error) {
      next(error);
    }
  };


  public getUserRating = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {receiver_id} = req.body;
      const user_rating = await this.user.getUserRating(receiver_id);
      const findOneUserData: User = await this.user.findUserById(receiver_id);
      res.status(201).json({ data: user_rating, receiver: findOneUserData, message: 'user rating list' });

    } catch (error) {
      next(error);
    }
  };

  ///// Admin functions
  public searchUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { searchKey } = req.body;
      const findAllUsersData: User[] = await this.user.findAllUser(searchKey);

      res.status(200).json({ data: findAllUsersData, message: 'search' });
    } catch (error) {
      next(error);
    }
  };

  public setAdminUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData = await this.user.findUserById(userId);
      const updateUserData: User[] = await this.user.setAdminUser(userId, userData.role == 0);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public setActiveUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData = await this.user.findUserById(userId);
      const updateUserData: User[] = await this.user.setActiveUser(userId, userData.is_active == 0);
      if(userData.is_active == 0) {
        await sendEmail(userData.email, 'birddogpro', 'Your account was reactivated', '');
      } else {
        await sendEmail(userData.email, 'birddogpro', 'Your account was deactivated', 'We detected some unusual action on your account.');
      }

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };
}
