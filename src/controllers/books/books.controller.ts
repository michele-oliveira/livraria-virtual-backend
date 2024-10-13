import { Request } from "express";
import {
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
  Req,
  UseBefore,
} from "routing-controllers";
import { upload } from "../../config/storage/upload";
import { AppDataSource } from "../../config/database/data-source";
import { Book } from "../../entities/book.entity";
import { BooksService } from "../../services/books/books.service";
import { NewBook, UpdateBook } from "../../services/books/books.type";

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
    { name: 'image_1', maxCount: 1 },
    { name: 'image_2', maxCount: 1 },
    { name: 'book_file', maxCount: 1 },
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

  @Put("/")
  @UseBefore(upload.fields([
    { name: 'image_1', maxCount: 1 },
    { name: 'image_2', maxCount: 1 },
    { name: 'book_file', maxCount: 1 },
  ]))
  async update(@Req() req: Request) {
    const body = req.body as Omit<UpdateBook, 'image_1' | 'image_2' | 'book_file'>;
    const files = req.files as Pick<UpdateBook, 'image_1' | 'image_2' | 'book_file'>;

    const newBookData = {
      ...body,
      ...files
    };

    return this.booksService.updateBook(newBookData);
  }

  @Delete("/:book_id")
  async delete(@Param('book_id') bookId: string) {
    return this.booksService.removeBook(bookId);
  }
}
