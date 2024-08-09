import { Service } from 'typedi';
import pg from '@database';
import { User } from '@interfaces/users.interface';
import { Property, PropertySharing } from '@interfaces/properties.interface';

@Service()
export class PropertyService {

  public async createProperty(propertyData: Property): Promise<Property> {
    const { userid, address, propertyType, description, contactName, contactPhone, price, notes, rating, lat, lon, published,
      customFields, lotSize, unit, phoneNumber, remodeled, yearBuilt, bedrooms, bathrooms, numberOfStories, image_keys, fee, referral_fee, sharing_option } = propertyData;

    const { rows: createPropertyData } = await pg.query(
      `
      INSERT INTO
        properties(
          "userid",
          "address",
          "propertyType",
          "description",
          "contactName",
          "contactPhone",
          "price",
          "notes",
          "rating",
          "lat",
          "lon",
          "published",
          "customFields",
          "createdAt",
          "updatedAt",
          "lotSize",
          "unit",
          "phoneNumber",
          "remodeled",
          "yearBuilt",
          "bedrooms",
          "bathrooms",
          "numberOfStories",
          "image_keys",
          "fee",
          "referral_fee",
          "sharing_option"
        )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW(), $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
      RETURNING *
      `,
      [userid, address, propertyType, description, contactName, contactPhone, price, notes, rating, lat, lon, published, customFields,
        lotSize, unit, phoneNumber, remodeled, yearBuilt, bedrooms, bathrooms, numberOfStories, image_keys, fee, referral_fee, sharing_option]
    );

    return createPropertyData[0];
  }

  public async updateProperty(propertyData: Property): Promise<number> {
    const { id, address, propertyType, description, contactName, contactPhone, price, notes, rating, lat, lon, published,
      customFields, lotSize, unit, phoneNumber, remodeled, yearBuilt, bedrooms, bathrooms, numberOfStories, image_keys, fee,referral_fee, sharing_option } = propertyData;

    const updateQuery =
      `
      UPDATE properties
      SET
        "address" = $1,
        "propertyType" = $2,
        "description" = $3,
        "contactName" = $4,
        "contactPhone" = $5,
        "price" = $6,
        "notes" = $7,
        "rating" = $8,
        "lat" = $9,
        "lon" = $10,
        "published" = $11,
        "customFields" = $12,
        "updatedAt" = NOW(),
        "lotSize" = $13,
        "unit" = $14,
        "phoneNumber" = $15,
        "remodeled" = $16,
        "yearBuilt" = $17,
        "bedrooms" = $18,
        "bathrooms" = $19,
        "numberOfStories" = $20,
        "image_keys" = $21,
        "fee" = $22,
        "referral_fee" = $23,
        "sharing_option" = $24
      WHERE
        id = $25
      `;
    const values = [address, propertyType, description, contactName, contactPhone, price, notes, rating, lat, lon, published, customFields,
      lotSize, unit, phoneNumber, remodeled, yearBuilt, bedrooms, bathrooms, numberOfStories, image_keys, fee, referral_fee, sharing_option, id];

    const result = await pg.query(updateQuery, values);
    return result.rowCount;
  }

  public async deleteProperty(property_id: number): Promise<number> {
    const result = await pg.query(
      `DELETE FROM properties WHERE id=$1`,
      [property_id]
    );

    return result.rowCount;
  }

  public async propertyPublishChange(property_id: number, published: boolean): Promise<number> {

    const updateQuery =
      `
      UPDATE properties
      SET
        "published" = $1
      WHERE
        id = $2
      `;
    const values = [published, property_id];

    const result = await pg.query(updateQuery, values);
    return result.rowCount;
  }

  public async propertyShareItem(property_id: number, field: String, value: boolean): Promise<number> {

    const query =
      `
      INSERT INTO
      property_sharing
      (
        property_id,
        field,
        value
      )
      VALUES ($1, $2, $3)
      ON CONFLICT (property_id, field)
      DO UPDATE SET value=$3
    `;

    const values = [property_id, field, value];

    const result = await pg.query(query, values);
    return result.rowCount;
  }

  // public async createPropertyImage(property_id: number, url: string): Promise<number> {
  //   const { rows: createPropertyImage } = await pg.query(
  //     `
  //     INSERT INTO
  //     property_images(
  //         "url",
  //         "property_id"
  //       )
  //     VALUES ($1, $2)
  //     RETURNING *
  //     `,
  //     [url, property_id],
  //   );

  //   return createPropertyImage[0];
  // }

  public async getPropertySharing(property_id: number): Promise<PropertySharing[]> {
    const query = `
    SELECT
      field, value
    FROM
      property_sharing
    WHERE property_id =
    ` + property_id;

    const { rows } = await pg.query(query);
    return rows;
  }

  public async getPropertyList(my_id: any, user_id: any, isMine: boolean): Promise<Property[]> {
    let query = `
    SELECT
      *, f_isfavorite(${my_id}, id) as is_favorite
    FROM
      properties
    `;
    if (isMine) {
      query += ` WHERE userid = ` + user_id
    }
    else {
      query += ` WHERE userid=` + user_id + ` OR ("marketShared" = ` + true + ` AND "status" = 1 AND f_isactive(userid) = true)`
    }

    const { rows } = await pg.query(query);
    return rows.sort((a, b) => { return a.id - b.id });
  }

  public async getAllProperties(my_id: any): Promise<Property[]> {
    const fields = `address, propertyType, description, contactName, contactPhone, price, lotSize, yearBuilt, bedrooms, bathrooms, fee, referral_fee, unit, status, createdAt`;
    let query = `
    SELECT
      ${fields}
    FROM
      properties
    `;
    if (my_id != 0) {
      query += ` WHERE userid = ` + my_id
    }

    const { rows } = await pg.query(query);
    return rows.sort((a, b) => { return a.id - b.id });
  }


  public async getPropertyListForMarket(page: any, count: any, searchKey: any): Promise<Property[]> {
    let query = `
    SELECT
      *, count(*) OVER() AS full_count
    FROM
      properties
    WHERE
      "status" = 1 AND f_isactive(userid) = true
    `;
    if (searchKey && searchKey != "") {
      query += ` AND "address" LIKE '%${searchKey}%'`
    }
    query += ` ORDER BY id ASC`
    query += ` LIMIT ` + count
    query += ` OFFSET ` + (page * count)
    try {

      const { rows } = await pg.query(query);
      return rows;
    } catch (error) {
      return []
    }
  }

  public async searchProperties(page: any, count: any, searchKey: any): Promise<Property[]> {
    let query = `
    SELECT
      *
    FROM
      properties
    `;
    if (searchKey && searchKey != "") {
      query += ` WHERE "address" LIKE '%${searchKey}%'`
    }
    query += ` ORDER BY id DESC`
    query += ` LIMIT ` + count
    query += ` OFFSET ` + (page * count)
    try {
      const { rows } = await pg.query(query);
      return rows;
    } catch (error) {
      return []
    }
  }


  public async searchCount(searchKey: any): Promise<Number> {
    let query = `
    SELECT
      count(*) AS cnt
    FROM
      properties
    `;
    if (searchKey && searchKey != "") {
      query += ` WHERE "address" LIKE '%${searchKey}%'`
    }
    try {
      const { rows } = await pg.query(query);
      return rows[0].cnt;
    } catch (error) {
      return 0
    }
  }


  public async getPropertyImageList(property_id: any): Promise<Property[]> {
    let query = `
    SELECT
      image_keys
    FROM
      properties
    WHERE
      id =
    `;
    query += property_id
    const { rows } = await pg.query(query);
    return rows;
  }

  public async getPropertyItem(property_id: any): Promise<Property[]> {
    let query = `
    SELECT
      *
    FROM
      properties
    WHERE
      id =
    `;
    query += property_id
    const { rows } = await pg.query(query);
    return rows;
  }

  public async getPropertyOwner(property_id: any): Promise<User[]> {
    let query = `
    SELECT
      t0.email, t0.phone, t0.name, t0.address, t0.image
    FROM
      users t0
    RIGHT JOIN
      properties t1
    ON
      t0.id = t1.userid
    WHERE
      t1.id =
    `;
    query += property_id;
    const { rows } = await pg.query(query);
    return rows;
  }


  public async setShareToMarketplace(property_id, shareToMarketplace): Promise<number> {

    const updateQuery =
      `
      UPDATE properties
      SET
        "marketShared" = $1
      WHERE
        id = $2
      `;
    const values = [shareToMarketplace, property_id];

    const result = await pg.query(updateQuery, values);
    return result.rowCount;
  }

  public async updateStatus(expire_date: string): Promise<number> {
    const expire_duration = expire_date ? expire_date : 30;
    const updateQuery = `UPDATE properties SET status = 2 WHERE published_at < NOW() - interval '${expire_duration}' day`;
    await pg.query(updateQuery);
    return;
  }

  public async setPropertyPublish(property_id, status): Promise<number> {

    let updateQuery =
      `
      UPDATE properties
      SET
        "status" = $1
      WHERE
        id = $2
      `;
    const values = [status, property_id];

    if (status == 1) {
      updateQuery =
      `
      UPDATE properties
      SET
        "status" = $1,
        "published_at" = NOW()
      WHERE
        id = $2
      `;
    }

    const result = await pg.query(updateQuery, values);
    return result.rowCount;
  }
}
