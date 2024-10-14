import { AppDataSource } from "./config/database/data-source";
import { Book } from "./entities/book.entity";
import { bookFilesPath, imagesPath } from "./constants/paths";
import {
  getFilesInDirectory,
  removeMultipleFilesFromDirectory,
} from "./utils/files";

const cleanup = async () => {
  await AppDataSource.initialize();
  const booksRepository = AppDataSource.getRepository(Book);
  const books = await booksRepository.find();
  await AppDataSource.destroy();

  const imagesInUse = books
    .map((book) => [book.image_1, book.image_2])
    .flat()
    .filter(Boolean);
  const bookFilesInUse = books.map((book) => book.book_file).filter(Boolean);

  const imagesToDelete = getFilesInDirectory(imagesPath).filter(
    (image) => !imagesInUse.includes(image)
  );
  const bookFilesToDelete = getFilesInDirectory(bookFilesPath).filter(
    (bookFile) => !bookFilesInUse.includes(bookFile)
  );

  removeMultipleFilesFromDirectory(imagesPath, imagesToDelete);
  removeMultipleFilesFromDirectory(bookFilesPath, bookFilesToDelete);
};

cleanup();
