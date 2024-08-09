import { Service } from 'typedi';
import pg from '@database';
import { Inquiry } from '@interfaces/inquiries.interface';

@Service()
export class InquiryService {

  public async getInquiries(property_id:any, searchKey: any = ''): Promise<Inquiry[]> {
    let query = `
    SELECT
      *, count(*) OVER() AS full_count
    FROM
      inquiries
    WHERE property_id = ${property_id}
    `;
    if (searchKey && searchKey != "") {
      query += ` WHERE "name" LIKE '%${searchKey}%' OR "email" LIKE '%${searchKey}%'`
    }
    query += ` ORDER BY id DESC`
    try {
      const { rows } = await pg.query(query);
      return rows;
    } catch (error) {
      return []
    }
  }

  public async createInquiry(inquiryData: Inquiry): Promise<Inquiry> {
    const { user_id, email, name, phone, message, receiver_email, receiver_name, receiver_phone, property_id } = inquiryData;
    const { rows: createInquiryData } = await pg.query(
      `
      INSERT INTO
        inquiries(
          "user_id",
          "email",
          "name",
          "phone",
          "message",
          "receiver_email",
          "receiver_name",
          "receiver_phone",
          "property_id",
          "createdAt",
          "updatedAt"
        )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
      `,
      [user_id, email, name, phone, message, receiver_email, receiver_name, receiver_phone, property_id]
    );
    return createInquiryData[0];
  }

  public async updateInquiry(inquiryData: Inquiry): Promise<number> {
    const { id, email, name, phone, message } = inquiryData;

    const updateQuery =
      `
      UPDATE inquiries
      SET
        "email" = $2,
        "name" = $3,
        "phone" = $4,
        "message" = $5,
        "updatedAt" = NOW()
      WHERE
        id = $1
      `;
    const values = [id, email, name, phone, message];

    const result = await pg.query(updateQuery, values);
    return result.rowCount;
  }

  public async deleteInquiry(inquiry_id: number): Promise<number> {
    const result = await pg.query(
      `DELETE FROM inquiries WHERE id=$1`,
      [inquiry_id]
    );

    return result.rowCount;
  }

}
