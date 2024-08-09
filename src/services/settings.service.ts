import { Service } from 'typedi';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { Setting } from '@interfaces/settings.interface';

@Service()
export class SettingService {
  public async save(settingData: Setting): Promise<Setting> {
    const { setting_key, setting_value } = settingData;

    const { rows } = await pg.query(
      `
    SELECT EXISTS(
      SELECT
        "setting_value"
      FROM
        settings
      WHERE
        setting_key = $1
    )`,
    [setting_key]
    );
    if (!rows[0].exists) {
      const { rows: createSettingData } = await pg.query(
        `
        INSERT INTO
          settings (
            "setting_key",
            "setting_value"
          )
        VALUES ($1, $2)
        RETURNING *
        `,
        [setting_key, setting_value],
      );

      return createSettingData[0];
    } else {
      const { rows: updateSettingData } = await pg.query(
        `
        UPDATE
          settings
        SET
          "setting_value" = $2
        WHERE
          "setting_key" = $1
        RETURNING *
      `,
        [setting_key, setting_value]
      );

      return updateSettingData[0];
    }
  }

  public async get(key: string): Promise<string> {
    const { rows, rowCount } = await pg.query(
      `
    SELECT
      setting_value
    FROM
      settings
    WHERE
      setting_key = $1
    `,
      [key]
    );
    if (!rowCount) return '';

    return rows[0].setting_value;
  }
}
