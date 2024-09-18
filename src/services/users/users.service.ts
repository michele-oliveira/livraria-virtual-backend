import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";
import { genSalt, hash } from "bcrypt";
import { UnauthorizedError } from "routing-controllers";
import { sign } from "jsonwebtoken";
import TokenizedUser from "../../interfaces/tokenizedUser";
import { NewUser, UserCredentials } from "./users.type";

export class UsersService {
    private usersRepository: Repository<User>;

    constructor(usersRepository: Repository<User>) {
        this.usersRepository = usersRepository;
    }

    async login(credentials: UserCredentials) {
        const { email, password } = credentials;
        try {
            const user = await this.usersRepository.findOneBy({ email }) as User;
            const hashedPassword = await hash(password, user.salt);
            
            if (hashedPassword === user.password) {
                const tokenizedUser: TokenizedUser = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
                const jwt = sign(tokenizedUser, process.env.JWT_SECRET!);
                return {
                    accessToken: jwt,
                }
            }
        } catch {
            throw new UnauthorizedError('User not found');
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
}