import { Router } from 'express';
import { PropertyController } from '@controllers/properties.controller';
import { Routes } from '@interfaces/routes.interface';
import { AdminAuthMiddleware, AuthMiddleware } from '@middlewares/auth.middleware';

export class PropertyRoute implements Routes {
  public path = '/properties';
  public router = Router();
  public property = new PropertyController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create-property`, AuthMiddleware, this.property.createProperty);
    this.router.post(`${this.path}/update-property`, AuthMiddleware, this.property.updateProperty);
    this.router.post(`${this.path}/delete-property`, AuthMiddleware, this.property.deleteProperty);
    this.router.get(`${this.path}/get-property-list`, AuthMiddleware, this.property.getPropertyList);
    this.router.get(`${this.path}/get-property-list-for-market`, this.property.getPropertyListForMarket);
    this.router.post(`${this.path}/get-property-item`, this.property.getPropertyItem);
    this.router.post(`${this.path}/get-property-image-list`, AuthMiddleware, this.property.getPropertyImageList);

    this.router.post(`${this.path}/property-publish-change`, AuthMiddleware, this.property.propertyPublishChange);
    this.router.post(`${this.path}/property-share-item`, AuthMiddleware, this.property.propertyShareItem);
    this.router.post(`${this.path}/get-property-sharing`, AuthMiddleware, this.property.getPropertySharing);

    this.router.post(`${this.path}/set-property-publish`, AuthMiddleware, this.property.setPropertyPublish); // 0: unpublish 1: publish 2: expired
    this.router.post(`${this.path}/set-share2marketplace`, AuthMiddleware, this.property.setShareToMarketplace);

    // admin function
    this.router.get(`${this.path}/all-properties`, AuthMiddleware, this.property.getAllProperties);
    this.router.get(`${this.path}/search-properties`, AdminAuthMiddleware, this.property.searchProperties);
  }
}
