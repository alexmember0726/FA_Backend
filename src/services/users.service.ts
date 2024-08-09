import { Service } from 'typedi';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { User, UserRating } from '@interfaces/users.interface';

@Service()
export class UserService {
  public async findAllUser(searchkey = ''): Promise<User[]> {
    if(searchkey) {
      const { rows } = await pg.query(`
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(name) like LOWER('%${searchkey}%') OR LOWER(email) like LOWER('%${searchkey}%')
        ORDER BY id ASC
        `);
      return rows;
    }

    const { rows } = await pg.query(`
      SELECT
        *
      FROM
        users
    `);
    return rows;
  }

  public async findUserById(userId: number): Promise<User> {
    const { rows, rowCount } = await pg.query(
      `
    SELECT
      *
    FROM
      users
    WHERE
      id = $1
    `,
      [userId],
    );
    if (!rowCount) throw new HttpException(409, "User doesn't exist");

    return rows[0];
  }

  public async createUser(userData: User): Promise<User> {
    const { email, address, image, license, name, phone } = userData;

    const { rows } = await pg.query(
      `
    SELECT EXISTS(
      SELECT
        "email"
      FROM
        users
      WHERE
        "email" = $1
    )`,
      [email],
    );
    if (rows[0].exists) throw new HttpException(409, `This email ${email} already exists`);

    const { rows: createUserData } = await pg.query(
      `
      INSERT INTO
        users(
          "email",
          "address",
          "image",
          "license",
          "name",
          "phone"
        )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [email, address, image, license, name, phone],
    );

    return createUserData[0];
  }

  public async updateUser(userId: number, userData: User): Promise<User[]> {
    const { rows: findUser } = await pg.query(
      `
      SELECT EXISTS(
        SELECT
          *
        FROM
          users
        WHERE
          "id" = $1
      )`,
      [userId],
    );
    if (!findUser[0].exists) throw new HttpException(409, "User doesn't exist");

    const { email, address, image, license, name, phone } = userData;
    const { rows: updateUserData } = await pg.query(
      `
      UPDATE
        users
      SET
        "email" = $2,
        "address" = $3,
        "image" = $4,
        "license" = $5,
        "name" = $6,
        "phone" = $7
      WHERE
        "id" = $1
      RETURNING *
    `,
      [userId, email, address, image, license, name, phone],
    );

    return updateUserData;
  }


  public async setAdminUser(userId: number, isAdmin: boolean): Promise<User[]> {
    const { rows: findUser } = await pg.query(
      `
      SELECT EXISTS(
        SELECT
          *
        FROM
          users
        WHERE
          "id" = $1
      )`,
      [userId]
    );
    if (!findUser[0].exists) throw new HttpException(409, "User doesn't exist");

    const { rows: updateUserData } = await pg.query(
      `
      UPDATE
        users
      SET
        "role" = $2
      WHERE
        "id" = $1
      RETURNING *
    `,
      [userId, isAdmin ? 1 : 0]
    );

    return updateUserData;
  }

  public async setActiveUser(userId: number, isActive: boolean): Promise<User[]> {
    const { rows: findUser } = await pg.query(
      `
      SELECT EXISTS(
        SELECT
          *
        FROM
          users
        WHERE
          "id" = $1
      )`,
      [userId]
    );
    if (!findUser[0].exists) throw new HttpException(409, "User doesn't exist");

    const { rows: updateUserData } = await pg.query(
      `
      UPDATE
        users
      SET
        "is_active" = $2
      WHERE
        "id" = $1
      RETURNING *
    `,
      [userId, isActive ? 1 : 0]
    );

    return updateUserData;
  }


  public async deleteUser(userId: number): Promise<User[]> {
    const { rows: findUser } = await pg.query(
      `
      SELECT EXISTS(
        SELECT
          "id"
        FROM
          users
        WHERE
          "id" = $1
      )`,
      [userId],
    );
    if (!findUser[0].exists) throw new HttpException(409, "User doesn't exist");

    const { rows: deleteUserData } = await pg.query(
      `
      DELETE
      FROM
        users
      WHERE
        id = $1
      RETURNING *
      `,
      [userId],
    );

    const { rows: deletedPropertyData } = await pg.query(
      `
      DELETE
      FROM
        properties
      WHERE
        userid = $1
      RETURNING *
      `,
      [userId],
    );

    const { rows: deletedFavoritesData } = await pg.query(
      `
      DELETE
      FROM
        properties
      WHERE
        user_id = $1
      RETURNING *
      `,
      [userId],
    );

    const { rows: deletedInquiriesData } = await pg.query(
      `
      DELETE
      FROM
        properties
      WHERE
        user_id = $1
      RETURNING *
      `,
      [userId],
    );

    return deleteUserData;
  }

  public async saveUserRating(rater_id, receiver_id, title, description, rating): Promise<UserRating> {

    const { rows } = await pg.query(
      `
      INSERT INTO
        user_rating(
          "receiver_id",
          "rater_id",
          "title",
          "description",
          "rating",
          "createdAt"
        )
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
      `,
      [receiver_id, rater_id, title, description, rating]
    );

    return rows[0];
  }


  public async getUserRating(receiver_id: any): Promise<UserRating[]> {
    let query = `
    SELECT
      *
    FROM
      user_rating
    WHERE
      receiver_id =
    `;
      query += receiver_id
    const { rows } = await pg.query(query);
    return rows.sort((a, b) => {return a.createdAt - b.createdAt});
  }
}
