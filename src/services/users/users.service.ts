import { In, Repository } from "typeorm";
import { genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "routing-controllers";
import { User } from "../../entities/user.entity";
import { Book } from "../../entities/book.entity";
import { getPublicBookFileUrl, getPublicImageUrl } from "../../utils/files";
import { BOOKS_PER_PAGE } from "../../constants/booksControllerDefaultConfigs";
import TokenizedUser from "../../interfaces/tokenizedUser";
import ResourceAlreadyExistent from "../../errors/ResourceAlreadyExistent.error";
import { NewUser, UserCredentials } from "./users.type";

export class UsersService {
  private readonly usersRepository: Repository<User>;
  private readonly booksRepository: Repository<Book>;

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

  async getFavoriteBooks(
    userId: string,
    page?: number,
    limit: number = BOOKS_PER_PAGE
  ) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["favoriteBooks"],
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!page || !limit) {
      const favoriteBooks = user.favoriteBooks;
      favoriteBooks.forEach((book) => {
        book.image_1 = getPublicImageUrl(book.image_1);
        book.image_2 = getPublicImageUrl(book.image_2);
        book.book_file = getPublicBookFileUrl(book.book_file);
      });

      return { books: favoriteBooks };
    }

    if (limit <= 0 || page <= 0) {
      throw new BadRequestError("Invalid pagination values");
    }

    const skip = (page - 1) * limit;

    const favoriteBooksIds = user.favoriteBooks.map((book) => book.id);

    const [favoriteBooks, total] = await this.booksRepository.findAndCount({
      where: { id: In(favoriteBooksIds) },
      skip,
      take: limit,
    });
    favoriteBooks.forEach((book) => {
      book.image_1 = getPublicImageUrl(book.image_1);
      book.image_2 = getPublicImageUrl(book.image_2);
      book.book_file = getPublicBookFileUrl(book.book_file);
    });

    return {
      books: favoriteBooks,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
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
