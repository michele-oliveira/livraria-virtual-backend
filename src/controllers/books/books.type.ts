import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

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
