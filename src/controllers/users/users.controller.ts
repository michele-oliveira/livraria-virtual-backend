import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  QueryParams,
} from "routing-controllers";
import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/user.entity";
import { Book } from "../../entities/book.entity";
import { UsersService } from "../../services/users/users.service";
import { ListFavoriteBookParams, NewUser, UserCredentials } from "./users.type";
import UserRole from "../../common/enums/userRole.enum";

@JsonController("/users")
export class UsersController {
  private readonly usersService: UsersService;

  constructor() {
    const usersRepository = AppDataSource.getRepository(User);
    const booksRepository = AppDataSource.getRepository(Book);
    this.usersService = new UsersService(usersRepository, booksRepository);
  }

  @Post("/login")
  async login(@Body({ validate: true }) credentials: UserCredentials) {
    return this.usersService.login(credentials);
  }

  @Post("/register")
  async register(@Body({ validate: true }) newUser: NewUser) {
    return this.usersService.createUser(newUser);
  }

  @Authorized(UserRole.USER)
  @Get("/favorite-books")
  async getFavoriteBooks(
    @CurrentUser() user: User,
    @QueryParams() params: ListFavoriteBookParams
  ) {
    const { page, limit } = params;

    return this.usersService.getFavoriteBooks(user.id, page, limit);
  }

  @Authorized(UserRole.USER)
  @Post("/favorite-books/:book_id")
  async addFavoriteBook(
    @CurrentUser() user: User,
    @Param("book_id") bookId: string
  ) {
    return this.usersService.addFavoriteBook(user.id, bookId);
  }

  @Authorized(UserRole.USER)
  @Delete("/favorite-books/:book_id")
  async removeFavoriteBook(
    @CurrentUser() user: User,
    @Param("book_id") bookId: string
  ) {
    return this.usersService.removeFavoriteBook(user.id, bookId);
  }
}
