import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
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
    { message: "pages must be a whole number" }
  )
  pages: string;

  @IsUUID()
  @IsNotEmpty()
  subgender_id: string;

  @IsString()
  @MinLength(24)
  @MaxLength(3584)
  description: string;
}

export class UpdateBook extends NewBook {
  @IsUUID()
  id: string;
}

export class ListBooksBySubgenderParams {
  @IsNumber()
  @Min(1)
  page = 1;

  @IsNumber()
  @Min(6)
  limit = BOOKS_PER_PAGE;
}

export class ListBookParams extends ListBooksBySubgenderParams {
  @IsString()
  @IsOptional()
  search: string;
}
