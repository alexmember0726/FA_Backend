import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Property } from '@interfaces/properties.interface';
import { PropertyService } from '@services/properties.service';
import { User } from '@interfaces/users.interface';
import { RequestWithUser } from '@interfaces/auth.interface';
import { SettingService } from '@/services/settings.service';

export class PropertyController {
  public property = Container.get(PropertyService);
  public setting = Container.get(SettingService);

  // public getPropertys = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const findAllPropertysData: Property[] = await this.property.findAllProperty();

  //     res.status(200).json({ data: findAllPropertysData, message: 'findAll' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public getPropertyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const propertyId = Number(req.params.id);
  //     const findOnePropertyData: Property = await this.property.findPropertyById(propertyId);

  //     res.status(200).json({ data: findOnePropertyData, message: 'findOne' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  public createProperty = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const propertyData: Property = req.body;
      propertyData.userid = userData.id;
      const createPropertyData: Property = await this.property.createProperty(propertyData);

      // const images = propertyData.image_urls.split(",");
      // if(images != null && images.length > 0) {
      //   createPropertyData.images_objs = [];
      //   for(const url of images) {
      //     if(url == '') continue;
      //     const property_image = await this.property.createPropertyImage(createPropertyData.id, url);
      //     createPropertyData.images_objs.push(property_image);
      //   }
      // }

      res.status(201).json({ data: createPropertyData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const propertyData: Property = req.body;
      const rowCount: number = await this.property.updateProperty(propertyData);

      res.status(200).json({ data: rowCount, message: 'user property updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const propertyId = Number(req.body.property_id);
      const rowCount: number = await this.property.deleteProperty(propertyId);

      res.status(200).json({ data: rowCount, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public propertyPublishChange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const propertyId = Number(req.body.property_id);
      const published = req.body.published;
      const rowCount: number = await this.property.propertyPublishChange(propertyId, published);

      res.status(200).json({ data: rowCount, message: 'publish changed' });
    } catch (error) {
      next(error);
    }
  };

  public propertyShareItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { property_id, field, value } = req.body;
      const rowCount: number = await this.property.propertyShareItem(property_id, field, value);

      res.status(200).json({ data: rowCount, message: 'publish changed' });
    } catch (error) {
      next(error);
    }
  };

  public getPropertySharing = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { property_id } = req.body;

      const property_sharing = await this.property.getPropertySharing(property_id);
      const userOwner = await this.property.getPropertyOwner(property_id);
      const empty = { name: '', address: '', image: '' };
      res.status(201).json({ data: property_sharing, owner: userOwner.length > 0 ? userOwner[0] : empty, message: 'property sharing' });

    } catch (error) {
      next(error);
    }
  };

  public getPropertyList = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;

      if (req.query.isMine == '1') {
        const properties = await this.property.getPropertyList(userData.id, userData.id, true);
        res.status(201).json({ data: properties, message: 'user property list' });
      } else {
        const properties = await this.property.getPropertyList(userData.id, userData.id, false);
        res.status(201).json({ data: properties, message: 'all property list' });
      }

    } catch (error) {
      next(error);
    }
  };

  public getPropertyImageList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { property_id } = req.body;
      const property_image_keys = await this.property.getPropertyImageList(property_id);
      res.status(201).json({ data: property_image_keys, message: 'user property image key list' });

    } catch (error) {
      next(error);
    }
  };


  public setShareToMarketplace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { property_id, shareToMarketplace } = req.body;
      const rowCount: number = await this.property.setShareToMarketplace(property_id, shareToMarketplace);

      res.status(200).json({ data: rowCount, message: 'property set share to marketplace updated' });
    } catch (error) {
      next(error);
    }
  };

  public setPropertyPublish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { property_id, status } = req.body;
      const rowCount: number = await this.property.setPropertyPublish(property_id, status);

      res.status(200).json({ data: rowCount, message: 'property publish status updated' });
    } catch (error) {
      next(error);
    }
  };

  // cron function
  public updateStatusJob = async () => {
    try {
      const expire_date = await this.setting.get('expire_date');
      await this.property.updateStatus(expire_date);
    } catch (error) {
      console.log(error);
    }
  }

  // admin functions
  public getAllProperties = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      if (userData.role == 1) {
        const properties = await this.property.getAllProperties(0);
        res.status(201).json({ data: properties, message: 'all property list' });
      } else {
        const properties = await this.property.getAllProperties(userData.id);
        res.status(201).json({ data: properties, message: 'all property list' });
      }
    } catch (error) {
      next(error);
    }
  };


  public searchProperties = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, count, searchKey } = req.query;
      const properties = await this.property.searchProperties(page || 0, count || 10, searchKey);
      const total = await this.property.searchCount(searchKey);
      res.status(200).json({ data: properties, message: 'all property list', total: total, nextPage: Number(page || 1) + 1 });

    } catch (error) {
      next(error);
    }
  };


  // user site endpoints
  public getPropertyListForMarket = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, count, searchKey } = req.query;
      const properties = await this.property.getPropertyListForMarket(page || 0, count || 10, searchKey);
      res.status(200).json({ data: properties, message: 'all property list', nextPage: Number(page || 1) + 1 });

    } catch (error) {
      next(error);
    }
  };

  public getPropertyItem = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { property_id } = req.body;

      const properties = await this.property.getPropertyItem(property_id);
      const property_sharing = await this.property.getPropertySharing(property_id);
      const sharing_data = {};
      if(property_sharing.length > 0) {
        for(let i = 0; i < property_sharing.length; i++) {
          const field = property_sharing[i].field;
          sharing_data[field] = property_sharing[i].value;
        }
      }
      res.status(200).json({ data: properties, sharing_data: sharing_data, message: 'property item' });
    } catch (error) {
      next(error);
    }
  };
}
