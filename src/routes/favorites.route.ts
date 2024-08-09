import { Router } from 'express';
import { FavoriteController } from '@controllers/favorites.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';

export class FavoriteRoute implements Routes {
  public path = '/favorites';
  public router = Router();
  public favorite = new FavoriteController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/update-favorite`, AuthMiddleware, this.favorite.updateFavorite);
    this.router.post(`${this.path}/check-favorite`, AuthMiddleware, this.favorite.isSetFavorite);
  }
}
