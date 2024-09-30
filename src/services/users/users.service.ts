import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";
import { genSalt, hash } from "bcrypt";
import { NotFoundError, UnauthorizedError } from "routing-controllers";
import { sign } from "jsonwebtoken";
import TokenizedUser from "../../interfaces/tokenizedUser";
import { NewUser, UserCredentials } from "./users.type";
import { Book } from "../../entities/book.entity";
import ResourceAlreadyExistent from "../../errors/ResourceAlreadyExistent.error";
import { getPublicImageUrl } from "../../utils/files";

export class UsersService {
  private usersRepository: Repository<User>;
  private booksRepository: Repository<Book>;

  constructor(
    usersRepository: Repository<User>,
    booksRepository: Repository<Book>
  ) {
    this.usersRepository = usersRepository;
    this.booksRepository = booksRepository;
  }

  async login(credentials: UserCredentials) {
    const { email, password } = credentials;
    try {
      const user = (await this.usersRepository.findOneBy({ email })) as User;
      const hashedPassword = await hash(password, user.salt);

      if (hashedPassword === user.password) {
        const tokenizedUser: TokenizedUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
        const jwt = sign(tokenizedUser, process.env.JWT_SECRET!);
        return {
          accessToken: jwt,
        };
      }
    } catch {
      throw new UnauthorizedError("User not found");
    }
  }

  async createUser(user: NewUser) {
    const newUser = this.usersRepository.create(user);
    newUser.salt = await genSalt();
    newUser.password = await hash(user.password, newUser.salt);
    return this.usersRepository.insert(newUser);
  }

  async getAllUsers() {
    return this.usersRepository.find();
  }

  async getFavoriteBooks(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["favoriteBooks"],
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user.favoriteBooks.map((book) => ({
      ...book,
      image_1: getPublicImageUrl(book.image_1),
      image_2: getPublicImageUrl(book.image_2),
    }));
  }

  async addFavoriteBook(userId: string, bookId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["favoriteBooks"],
    });
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    const book = await this.booksRepository.findOneBy({ id: bookId });
    if (!book) {
      throw new NotFoundError("Book does not exist");
    }

    if (user.favoriteBooks.find((book) => book.id === bookId)) {
      throw new ResourceAlreadyExistent("Book is already in favorites");
    } else {
      user.favoriteBooks.push(book);
    }

    await this.usersRepository.save(user);
    return null;
  }

  async removeFavoriteBook(userId: string, bookId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["favoriteBooks"],
    });
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    const book = await this.booksRepository.findOneBy({ id: bookId });
    if (!book) {
      throw new NotFoundError("Book does not exist");
    }
    if (user.favoriteBooks.find((book) => book.id === bookId)) {
      user.favoriteBooks = user.favoriteBooks.filter(
        (book) => book.id !== bookId
      );
    } else {
      throw new NotFoundError("Book is not in favorites");
    }

    await this.usersRepository.save(user);
    return null;
  }
}
