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

export type DeleteBookFilesParams = Pick<
  NewBook,
  "image_1" | "image_2" | "book_file"
>;
