import { IsArray, IsNumber, IsObject, IsString } from 'class-validator'

export class CreatePropertyDto {
  @IsString()
  public address: string;

  @IsArray()
  public images: string;

  @IsString()
  public property_type: string;

  @IsString()
  public description: string;

  @IsString()
  public contact_name: string;

  @IsString()
  public contact_phone: string;

  @IsNumber()
  public price: string;

  @IsString()
  public notes: string;

  @IsString()
  public rating: number;

  @IsObject()
  public additional_info: any
}

export class UpdatePropertyDto {
  @IsString()
  public address: string;

  @IsArray()
  public images: string;

  @IsString()
  public property_type: string;

  @IsString()
  public description: string;

  @IsString()
  public contact_name: string;

  @IsString()
  public contact_phone: string;

  @IsNumber()
  public price: string;

  @IsString()
  public notes: string;

  @IsString()
  public rating: number;

  @IsObject()
  public additional_info: any;
}
