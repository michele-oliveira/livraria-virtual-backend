import { BadRequestError, NotFoundError } from "routing-controllers";
import { ILike, Repository } from "typeorm";
import path from "path";
import { Book } from "../../entities/book.entity";
import { deleteFile, getPublicImageUrl } from "../../utils/files";
import { bookFilesPath, imagesPath } from "../../constants/paths";
import { DeleteBookFilesParams, NewBook } from "./books.type";

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
    });

    return books;
  }

  async getById(bookId: string) {
    const book = await this.booksRepository.findOneBy({ id: bookId });
    if (book) {
      book.image_1 = getPublicImageUrl(book.image_1);
      book.image_2 = getPublicImageUrl(book.image_2);
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

  async newBook(newBook: NewBook) {
    try {
      const image_1 = newBook.image_1[0] || null;
      const image_2 = newBook.image_2[0] || null;
      const book_file = newBook.book_file[0] || null;
  
      if (!image_1 || !image_2 || !book_file) {
        throw new BadRequestError("image_1, image_2, or book_file are missing")
      }
  
      const book = this.booksRepository.create({
        ...newBook,
        image_1: image_1.filename,
        image_2: image_2.filename,
        book_file: book_file.filename,
      });
  
      await this.booksRepository.insert(book);
  
      return book;
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

  private deleteBookFiles(files: DeleteBookFilesParams) {
    try {
      Object.values(files).forEach((file) => {
        if (file?.[0]) {
          if (file[0].mimetype.startsWith("image")) {
            deleteFile(path.join(imagesPath, file[0].filename));
          } else {
            deleteFile(path.join(bookFilesPath, file[0].filename));
          }
        }
      })
    } catch (error) {
      console.error(error);
    }
  }
}
