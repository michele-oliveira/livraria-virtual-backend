import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { BOOKS_PER_PAGE } from "../../constants/booksControllerDefaultConfigs";

export class NewBook {
  @IsString()
  @IsNotEmpty()
  book_name: string;

  @IsString()
  @MinLength(8)
  author: string;

  @IsString()
  @IsNotEmpty()
  publisher: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsNumberString(
    { no_symbols: true },
    { message: "pages mmust be a whole number" }
  )
  pages: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @MinLength(24)
  @MaxLength(3584)
  description: string;
}

export class UpdateBook extends NewBook {
  @IsUUID()
  id: string;
}

export class ListBookParams {
  @IsNumber()
  @IsPositive()
  @Min(1)
  page = 1;

  @IsNumber()
  @IsPositive()
  @Min(6)
  limit = BOOKS_PER_PAGE;

  @IsString()
  @IsOptional()
  search: string;
}
