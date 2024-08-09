import { Service } from 'typedi';
import pg from '@database';
import { Favorite } from '@interfaces/favorites.interface';

@Service()
export class FavoriteService {

  public async createFavorite(favoriteData: Favorite): Promise<Favorite> {
    const { user_id, property_id } = favoriteData;
    const { rows: createInquiryData } = await pg.query(
      `
      INSERT INTO
        favorites(
          "user_id",
          "property_id",
          "createdAt"
        )
      VALUES ($1, $2, NOW())
      RETURNING *
      `,
      [user_id, property_id]
    );
    return createInquiryData[0];
  }

  public async deleteFavorite(favoriteData: Favorite): Promise<number> {
    const { user_id, property_id } = favoriteData;
    const result = await pg.query(
      `DELETE FROM favorites WHERE user_id=$1 AND property_id=$2`,
      [user_id, property_id]
    );

    return result.rowCount;
  }

  public async isSetFavorite(favoriteData: Favorite): Promise<boolean> {
    const { user_id, property_id } = favoriteData;
    const { rows } = await pg.query(
      `
    SELECT EXISTS(
      SELECT
        *
      FROM
        favorites
      WHERE
        "user_id" = $1 AND "property_id" = $2
    )`,
      [user_id, property_id],
    );
    return rows[0].exists;
  }

}
