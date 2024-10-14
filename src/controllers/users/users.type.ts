import { IsEmail, IsString, MinLength } from "class-validator";

export class UserCredentials {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class NewUser {
  @IsString()
  @MinLength(6)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
