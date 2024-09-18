import { Get, JsonController, Param } from "routing-controllers";
import { Repository } from "typeorm";
import { Book } from "../../entities/book.entity";
import { BooksService } from "../../services/books/books.service";
import { AppDataSource } from "../../config/database/data-source";

@JsonController("/books")
export class BooksController {
  private booksService: BooksService;

  constructor() {
    const booksRepository = AppDataSource.getRepository(Book);
    this.booksService = new BooksService(booksRepository);
  }
  @Get("/")
  async list() {
    return this.booksService.list();
  }

  @Get("/:book_id")
  getById(@Param("book_id") bookId: string) {
    return this.booksService.getById(bookId);
  }
}
