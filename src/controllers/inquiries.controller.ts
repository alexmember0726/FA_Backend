import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Inquiry } from '@interfaces/inquiries.interface';
import { InquiryService } from '@services/inquiries.service';
import { User } from '@interfaces/users.interface';
import { RequestWithUser } from '@interfaces/auth.interface';
import { PropertyService } from '@/services/properties.service';

export class InquiryController {
  public inquiry = Container.get(InquiryService);
  public property = Container.get(PropertyService);


  public getInquiries = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const property_id = Number(req.params.property_id);

      const inquiries = await this.inquiry.getInquiries(property_id);
      res.status(201).json({ data: inquiries, message: 'property inquiry list' });

    } catch (error) {
      next(error);
    }
  };


  public createInquiry = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const inquiryData: Inquiry = req.body;
      inquiryData.user_id = userData.id;
      const property_id: any = req.body.property_id;
      if(property_id) {
        const ownerData = await this.property.getPropertyOwner(property_id);
        if(ownerData.length > 0) {
          inquiryData.receiver_email = ownerData[0].email;
          inquiryData.receiver_name = ownerData[0].name;
          inquiryData.receiver_phone = ownerData[0].phone;
        }
      }

      const createInquiryData: Inquiry = await this.inquiry.createInquiry(inquiryData);

      res.status(201).json({ data: createInquiryData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateInquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const inquiryData: Inquiry = req.body;
      const rowCount: number = await this.inquiry.updateInquiry(inquiryData);

      res.status(200).json({ data: rowCount, message: 'user inquiry updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteInquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const inquiryId = Number(req.body.inquiry_id);
      const rowCount: number = await this.inquiry.deleteInquiry(inquiryId);

      res.status(200).json({ data: rowCount, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
