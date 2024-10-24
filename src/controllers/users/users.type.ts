import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";

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

export class ListFavoriteBookParams {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(6)
  limit?: number;
}
