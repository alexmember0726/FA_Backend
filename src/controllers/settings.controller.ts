import { Setting } from '@/interfaces/settings.interface';
import { SettingService } from '@/services/settings.service';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export class SettingController {
  public setting = Container.get(SettingService);

  public getValue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {setting_key} = req.body;
      const settingValue: string = await this.setting.get(setting_key);

      res.status(200).json({ value: settingValue, message: 'getValue' });
    } catch (error) {
      next(error);
    }
  };

  public setValue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settingData: Setting = req.body;
      const settingValue: Setting = await this.setting.save(settingData);

      res.status(200).json({ data: settingValue, message: 'setValue' });
    } catch (error) {
      next(error);
    }
  };
}
