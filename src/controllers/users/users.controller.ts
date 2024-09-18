import { Authorized, Body, Get, JsonController, Post } from "routing-controllers";
import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/user.entity";
import { NewUser, UserCredentials } from "./users.type";
import { UsersService } from "../../services/users/users.service";

@JsonController("/users")
export class UsersController {
  private usersService: UsersService;

  constructor() {
    const usersRepository = AppDataSource.getRepository(User);
    this.usersService = new UsersService(usersRepository);
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
}
