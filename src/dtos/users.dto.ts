import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public name: string;

  @IsString()
  public address: string;

  @IsString()
  public phone: string;

  @IsString()
  public license: string;

  @IsString()
  public image: string;

}

export class UpdateUserDto {

  @IsString()
  public name: string;

  @IsString()
  public address: string;

  @IsString()
  public phone: string;

  @IsString()
  public license: string;
}
