import { NextFunction, Response } from 'express';
import { Container } from 'typedi';
import { Favorite } from '@interfaces/favorites.interface';
import { FavoriteService } from '@services/favorites.service';
import { User } from '@interfaces/users.interface';
import { RequestWithUser } from '@interfaces/auth.interface';

export class FavoriteController {
  public favorite = Container.get(FavoriteService);

  public updateFavorite = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const favoriteData: Favorite = req.body;
      favoriteData.user_id = userData.id;
      const isSet: boolean = await this.favorite.isSetFavorite(favoriteData);
      if (isSet) {
        await this.favorite.deleteFavorite(favoriteData);
        res.status(200).json({ data: isSet, message: 'user favorite unset' });
      } else {
        await this.favorite.createFavorite(favoriteData);
        res.status(200).json({ data: isSet, message: 'user favorite set' });
      }
    } catch (error) {
      next(error);
    }
  };

  public isSetFavorite = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const favoriteData: Favorite = req.body;
      favoriteData.user_id = userData.id;
      const isSet: boolean = await this.favorite.isSetFavorite(favoriteData);
      res.status(200).json({ data: isSet, message: 'user favorite info' });
    } catch (error) {
      next(error);
    }
  };

}
