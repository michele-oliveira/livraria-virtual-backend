import { Request } from "express";
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParams,
  Req,
  UseAfter,
  UseBefore,
} from "routing-controllers";
import { upload } from "../../config/storage/upload";
import { AppDataSource } from "../../config/database/data-source";
import { Book } from "../../entities/book.entity";
import { Gender } from "../../entities/gender.entity";
import { Subgender } from "../../entities/subgender.entity";
import { BooksService } from "../../services/books/books.service";
import {
  ListBookParams,
  ListBooksBySubgenderParams,
  NewBook as NewBookBody,
  UpdateBook as UpdateBookBody,
} from "./books.type";
import { FailedUploadsMiddleware } from "../../config/middlewares/failedUploads.middleware";
import { BookFilesDTO, NewBookDTO, UpdateBookDTO } from "../../interfaces/dto";

@JsonController("/books")
export class BooksController {
  private readonly booksService: BooksService;

  constructor() {
    const booksRepository = AppDataSource.getRepository(Book);
    const gendersRepository = AppDataSource.getRepository(Gender);
    const subgendersRepository = AppDataSource.getRepository(Subgender);

    this.booksService = new BooksService(
      booksRepository,
      gendersRepository,
      subgendersRepository
    );
  }

  @Get("/list-genders")
  async listGenders() {
    return this.booksService.listGenders();
  }

  @Get("/")
  async list(@QueryParams() params: ListBookParams) {
    const { search, page, limit } = params;

    if (search) {
      return this.booksService.searchBooks(search, page, limit);
    }
    return this.booksService.list(page, limit);
  }

  @Get("/by-subgender/:subgender_id")
  async listBySubgender(
    @Param('subgender_id') subgenderId: string,
    @QueryParams() params: ListBooksBySubgenderParams,
  ) {
    const { page, limit } = params;

    return this.booksService.list(page, limit, subgenderId);
  }

  @Get("/:book_id")
  getById(@Param("book_id") bookId: string) {
    return this.booksService.getById(bookId);
  }

  @Post("/")
  @UseBefore(
    upload.fields([
      { name: "image_1", maxCount: 1 },
      { name: "image_2", maxCount: 1 },
      { name: "book_file", maxCount: 1 },
    ])
  )
  @UseAfter(FailedUploadsMiddleware)
  async create(
    @Req() req: Request,
    @Body({ validate: true }) body: NewBookBody
  ) {
    const files = req.files as unknown as BookFilesDTO;

    const newBookData: NewBookDTO = {
      ...body,
      ...files,
      pages: parseInt(body.pages),
    };

    return this.booksService.newBook(newBookData);
  }

  @Put("/")
  @UseBefore(
    upload.fields([
      { name: "image_1", maxCount: 1 },
      { name: "image_2", maxCount: 1 },
      { name: "book_file", maxCount: 1 },
    ])
  )
  @UseAfter(FailedUploadsMiddleware)
  async update(
    @Req() req: Request,
    @Body({ validate: true }) body: UpdateBookBody
  ) {
    const files = req.files as unknown as BookFilesDTO;

    const newBookData: UpdateBookDTO = {
      ...body,
      ...files,
      pages: parseInt(body.pages),
    };

    return this.booksService.updateBook(newBookData);
  }

  @Delete("/:book_id")
  async delete(@Param("book_id") bookId: string) {
    return this.booksService.removeBook(bookId);
  }
}
