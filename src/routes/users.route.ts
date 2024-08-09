import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware, AdminAuthMiddleware } from '@middlewares/auth.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.user.getUsers);
    this.router.get(`${this.path}/:id(\\d+)`, this.user.getUserById);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateUserDto), this.user.createUser);
    this.router.put(`${this.path}/:id(\\d+)`, ValidationMiddleware(CreateUserDto, true), this.user.updateUser);
    this.router.delete(`${this.path}/:id(\\d+)`, this.user.deleteUser);

    this.router.post(`${this.path}/save-user-rating`, AuthMiddleware, this.user.saveUserRating);
    this.router.post(`${this.path}/get-user-rating`, AuthMiddleware, this.user.getUserRating);

    // admin functions
    this.router.post(`${this.path}/search`, AdminAuthMiddleware, this.user.searchUsers);
    this.router.post(`${this.path}/set-admin-user/:id(\\d+)`, AdminAuthMiddleware, this.user.setAdminUser);
    this.router.post(`${this.path}/set-active-user/:id(\\d+)`, AdminAuthMiddleware, this.user.setActiveUser);
  }
}
