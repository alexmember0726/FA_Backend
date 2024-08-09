import { Router } from 'express';
import { InquiryController } from '@controllers/inquiries.controller';
import { Routes } from '@interfaces/routes.interface';
import { AdminAuthMiddleware, AuthMiddleware } from '@middlewares/auth.middleware';

export class InquiryRoute implements Routes {
  public path = '/inquiries';
  public router = Router();
  public inquiry = new InquiryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create-inquiry`, AuthMiddleware, this.inquiry.createInquiry);
    this.router.post(`${this.path}/update-inquiry`, AuthMiddleware, this.inquiry.updateInquiry);
    this.router.post(`${this.path}/delete-inquiry`, AuthMiddleware, this.inquiry.deleteInquiry);

    // admin functions
    this.router.get(`${this.path}/get-inquiries/:property_id(\\d+)`, AdminAuthMiddleware, this.inquiry.getInquiries);
  }
}
