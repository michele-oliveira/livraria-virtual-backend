import { ILike, Repository } from "typeorm";
import { NotFoundError } from "routing-controllers";
import { Book } from "../../entities/book.entity";
import { getPublicImageUrl } from "../../utils/files";

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
}
