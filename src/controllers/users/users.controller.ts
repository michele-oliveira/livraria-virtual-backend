import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post } from "routing-controllers";
import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/user.entity";
import { Book } from "../../entities/book.entity";
import { UsersService } from "../../services/users/users.service";
import { NewUser, UserCredentials } from "./users.type";

@JsonController("/users")
export class UsersController {
  private readonly usersService: UsersService;

  constructor() {
    const usersRepository = AppDataSource.getRepository(User);
    const booksRepository = AppDataSource.getRepository(Book);
    this.usersService = new UsersService(usersRepository, booksRepository);
  }

  @Post("/login")
  async login(@Body() credentials: UserCredentials) {
    return this.usersService.login(credentials);
  }

  @Post("/register")
  async register(@Body() newUser: NewUser) {
    return this.usersService.createUser(newUser);
  }

  @Authorized()
  @Get("/list")
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Authorized()
  @Get("/favorite-books")
  async getFavoriteBooks(@CurrentUser() user: User) {
    return this.usersService.getFavoriteBooks(user.id);
  }

  @Authorized()
  @Post("/favorite-books/:book_id")
  async addFavoriteBook(@CurrentUser() user: User, @Param("book_id") bookId: string) {
    return this.usersService.addFavoriteBook(user.id, bookId);
  }

  @Authorized()
  @Delete("/favorite-books/:book_id")
  async removeFavoriteBook(@CurrentUser() user: User, @Param("book_id") bookId: string) {
    return this.usersService.removeFavoriteBook(user.id, bookId);
  }
}
