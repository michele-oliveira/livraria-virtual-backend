export interface NewBookDTO {
  book_name: string;
  author: string;
  publisher: string;
  language: string;
  pages: number;
  gender: string;
  description: string;
  image_1: Express.Multer.File[];
  image_2: Express.Multer.File[];
  book_file: Express.Multer.File[];
}

export interface UpdateBookDTO extends NewBookDTO {
  id: string;
}

export type BookFilesDTO = {
  image_1: Express.Multer.File[];
  image_2: Express.Multer.File[];
  book_file: Express.Multer.File[];
}
