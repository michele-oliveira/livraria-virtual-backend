import { IsEmail, IsNumber, IsPositive, IsString, Min, MinLength } from "class-validator";
import { BOOKS_PER_PAGE } from "../../constants/booksControllerDefaultConfigs";

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
  @IsNumber()
  @IsPositive()
  @Min(1)
  page = 1;

  @IsNumber()
  @IsPositive()
  @Min(6)
  limit = BOOKS_PER_PAGE;
}
