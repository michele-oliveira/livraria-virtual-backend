import path from "path";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { EntityNotFoundError, ILike, Repository } from "typeorm";
import { Book } from "../../entities/book.entity";
import {
  compareFiles,
  deleteFile,
  getPublicBookFileUrl,
  getPublicImageUrl,
} from "../../utils/files";
import { bookFilesPath, imagesPath } from "../../constants/paths";
import { BookFiles, BookFilesNames, NewBook, UpdateBook } from "./books.type";

export class BooksService {
  private readonly booksRepository: Repository<Book>;

  constructor(booksRepository: Repository<Book>) {
    this.booksRepository = booksRepository;
  }

  async list() {
    const books = await this.booksRepository.find();
    books.forEach((book) => {
      book.image_1 = getPublicImageUrl(book.image_1);
      book.image_2 = getPublicImageUrl(book.image_2);
      book.book_file = getPublicBookFileUrl(book.book_file);
    });

    return books;
  }

  async getById(bookId: string) {
    const book = await this.booksRepository.findOneBy({ id: bookId });
    if (book) {
      book.image_1 = getPublicImageUrl(book.image_1);
      book.image_2 = getPublicImageUrl(book.image_2);
      book.book_file = getPublicBookFileUrl(book.book_file);
      return book;
    } else {
      throw new NotFoundError("book not found");
    }
  }

  async searchBooks(search: string) {
    const books = await this.booksRepository.find({
      where: [
        { book_name: ILike(`%${search}%`) },
        { author: ILike(`%${search}%`) },
        { gender: ILike(`%${search}%`) },
        { publisher: ILike(`%${search}%`) },
      ],
    });
    books.forEach((book) => {
      book.image_1 = getPublicImageUrl(book.image_1);
      book.image_2 = getPublicImageUrl(book.image_2);
    });

    return books;
  }

  async newBook(newBook: NewBook): Promise<Book> {
    try {
      const { image_1: image1, image_2: image2, book_file: bookFile } = newBook;

      if (!image1?.[0] || !image2?.[0] || !bookFile?.[0]) {
        throw new BadRequestError("image_1, image_2, or book_file are missing");
      }

      const book = this.booksRepository.create({
        ...newBook,
        image_1: image1[0].filename,
        image_2: image2[0].filename,
        book_file: bookFile[0].filename,
      });

      await this.booksRepository.insert(book);

      return {
        ...book,
        image_1: getPublicImageUrl(book.image_1),
        image_2: getPublicImageUrl(book.image_2),
        book_file: getPublicBookFileUrl(book.book_file),
      };
    } catch (error) {
      console.error(error);
      this.deleteBookFiles({
        image_1: newBook.image_1,
        image_2: newBook.image_2,
        book_file: newBook.book_file,
      });

      throw error;
    }
  }

  async updateBook(updatedBook: UpdateBook): Promise<Book> {
    try {
      const {
        image_1: image1,
        image_2: image2,
        book_file: bookFile,
      } = updatedBook;

      if (!image1?.[0] || !image2?.[0] || !bookFile?.[0]) {
        throw new BadRequestError("image_1, image_2, or book_file are missing");
      }

      const existingBook = await this.booksRepository.findOneByOrFail({
        id: updatedBook.id,
      });

      const updatedFileNames = await this.updateFileStorage(existingBook, {
        image_1: image1,
        image_2: image2,
        book_file: bookFile,
      });

      const updatedBookEntity = this.booksRepository.create({
        ...updatedBook,
        ...updatedFileNames,
      });

      await this.booksRepository.save(updatedBookEntity);

      return {
        ...updatedBookEntity,
        image_1: getPublicImageUrl(updatedBookEntity.image_1),
        image_2: getPublicImageUrl(updatedBookEntity.image_2),
        book_file: getPublicBookFileUrl(updatedBookEntity.book_file),
      };
    } catch (error) {
      console.error(error);
      this.deleteBookFiles({
        image_1: updatedBook.image_1,
        image_2: updatedBook.image_2,
        book_file: updatedBook.book_file,
      });
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundError("Book not found");
      }

      throw error;
    }
  }

  async removeBook(bookId: string) {
    try {
      const book = await this.booksRepository.findOneByOrFail({ id: bookId });
      await this.booksRepository.remove(book);
      return null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private deleteBookFiles(files: BookFiles) {
    try {
      Object.values(files).forEach((file) => {
        if (file?.[0]) {
          if (file[0].mimetype.startsWith("image")) {
            deleteFile(path.join(imagesPath, file[0].filename));
          } else {
            deleteFile(path.join(bookFilesPath, file[0].filename));
          }
        }
      });
    } catch (error) {
      console.error("Error during file deletion", error);
    }
  }

  private async updateFileStorage(
    existingBook: Book,
    newFiles: BookFiles
  ): Promise<BookFilesNames> {
    let bookFilesNames: BookFilesNames = {
      image_1: existingBook.image_1,
      image_2: existingBook.image_2,
      book_file: existingBook.book_file,
    };

    for (const [key, files] of Object.entries(newFiles)) {
      const newFile = files?.[0];

      if (newFile) {
        const baseFilePath = newFile.mimetype.startsWith("image")
          ? imagesPath
          : bookFilesPath;
        const oldFileName = existingBook[key as keyof Book] as string;
        const isFaleIdentical = await compareFiles(
          path.join(baseFilePath, oldFileName),
          newFile.path
        );
        if (isFaleIdentical) {
          deleteFile(newFile.path);
          bookFilesNames[key as keyof BookFilesNames] = oldFileName;
        } else {
          deleteFile(path.join(baseFilePath, oldFileName));
          bookFilesNames[key as keyof BookFilesNames] = newFile.filename;
        }
      }
    }
    return bookFilesNames;
  }
}
