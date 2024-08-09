import { sign, verify } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: user.id };
  const expiresIn: number = 30 * 24 * 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

const getAuthorization = (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>) => {
  const cookie = req.cookies['Authorization'];
  if (cookie) return cookie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

@Service()
export class AuthService {
  public async signup(userData: User): Promise<User> {
    const { email, address, image, license, name, phone } = userData;

    const { rows: findUser } = await pg.query(
      `
    SELECT EXISTS(
      SELECT
        *
      FROM
        users
      WHERE
        "email" = $1
    )`,
      [email],
    );
    if (findUser[0].exists) throw new HttpException(409, `This email ${userData.email} already exists`);

      const { rows: signUpUserData } = await pg.query(
        `
      INSERT INTO
        users(
          "email",
          "name",
          "address",
          "phone",
          "license",
          "image"
        )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
        [email, name, address, phone, license, image],
      );

    return signUpUserData[0];
  }

  public async login(userData: User): Promise<{ cookie: string; findUser: User; token: string }> {
    const { email } = userData;

    const { rows, rowCount } = await pg.query(
      `
      SELECT
        *
      FROM
        users
      WHERE
        "email" = $1 AND "is_active" = 1
    `,
      [email],
    );
    if (!rowCount) throw new HttpException(409, `This email ${email} was not found`);


    const tokenData = createToken(rows[0]);
    const cookie = createCookie(tokenData);
    return { cookie, token: tokenData.token, findUser: rows[0] };
  }

  public async getLoggedInUser(req: Request): Promise<{ cookie: string; findUser: User; token: string }> {
    const Authorization = getAuthorization(req);
    let user: any, cookie: string;

    if (Authorization) {
      const { id } = verify(Authorization, SECRET_KEY) as DataStoredInToken;
      const { rows, rowCount } = await pg.query(
        `
        SELECT
          *
        FROM
          users
        WHERE
          "id" = $1
      `,
        [id],
      );

      if (rowCount) {
        const tokenData = createToken(rows[0]);
        cookie = createCookie(tokenData);
        user = rows[0];

        return { cookie, token: tokenData.token, findUser: user };

      } else {
        return { cookie: '', token: null, findUser: null };
      }
    } else {
      return { cookie: '', token: null, findUser: null };
    }
  }

  public async logout(userData: User): Promise<User> {
    const { email } = userData;

    const { rows, rowCount } = await pg.query(
      `
    SELECT
        *
      FROM
        users
      WHERE
        "email" = $1
    `,
      [email],
    );
    if (!rowCount) throw new HttpException(409, "User doesn't exist");

    return rows[0];
  }

  public async verifyAccount(email): Promise<number> {
    const { rowCount } = await pg.query(
      `SELECT
        *
      FROM
        users
      WHERE
        "email" = $1
    `,
      [email],
    );

    return rowCount;
  }


  public async forgotPassword(email): Promise<number> {

    const { rowCount } = await pg.query(
      `
    SELECT
        *
      FROM
        users
      WHERE
        "email" = $1
    `,
      [email],
    );

    return rowCount;
  }
}
