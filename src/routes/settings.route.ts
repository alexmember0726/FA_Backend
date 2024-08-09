import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware, AdminAuthMiddleware } from '@middlewares/auth.middleware';
import { SettingController } from '@/controllers/settings.controller';

export class SettingRoute implements Routes {
  public path = '/settings';
  public router = Router();
  public setting = new SettingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // admin functions
    this.router.post(`${this.path}/get-value`, AdminAuthMiddleware, this.setting.getValue);
    this.router.post(`${this.path}/set-value`, AdminAuthMiddleware, this.setting.setValue);
  }
}
