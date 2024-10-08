import {
  Get,
  JsonController,
  Param,
  Post,
  QueryParam,
  Req,
  UseBefore,
} from "routing-controllers";
import { Book } from "../../entities/book.entity";
import { BooksService } from "../../services/books/books.service";
import { AppDataSource } from "../../config/database/data-source";
import { upload } from "../../config/storage/upload";
import { NewBook } from "../../services/books/books.type";
import { Request } from "express";

@JsonController("/books")
export class BooksController {
  private readonly booksService: BooksService;

  constructor() {
    const booksRepository = AppDataSource.getRepository(Book);
    this.booksService = new BooksService(booksRepository);
  }

  @Get("/")
  async list(@QueryParam("search") search?: string) {
    if (search) {
      return this.booksService.searchBooks(search);
    }
    return this.booksService.list();
  }

  @Get("/:book_id")
  getById(@Param("book_id") bookId: string) {
    return this.booksService.getById(bookId);
  }

  @Post("/")
  @UseBefore(upload.fields([
    { name: 'image_1' },
    { name: 'image_2' },
    { name: 'book_file' },
  ]))
  async create(@Req() req: Request) {
    const body = req.body as Omit<NewBook, 'image_1' | 'image_2' | 'book_file'>;
    const files = req.files as Pick<NewBook, 'image_1' | 'image_2' | 'book_file'>;

    const newBookData = {
      ...body,
      ...files
    };

    return this.booksService.newBook(newBookData);
  }
}
