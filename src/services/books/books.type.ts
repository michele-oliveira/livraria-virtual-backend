export type NewBook = {
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
};

export type UpdateBook = { id: string } & NewBook;

export type BookFiles = Pick<
  NewBook,
  "image_1" | "image_2" | "book_file"
>;

export type BookFilesNames = {
  [K in keyof BookFiles]: string;
}