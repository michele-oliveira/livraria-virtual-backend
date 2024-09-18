import { Action, UnauthorizedError } from "routing-controllers";
import { verify } from "jsonwebtoken";
import { decodeJwt, getJwtFromRequestHeaders } from "../../utils/jwt";
import { AppDataSource } from "../database/data-source";
import { User } from "../../entities/user.entity";

export const authorizationInterceptor = async (action: Action, roles: string[] = []) => {
    try {
        const token = getJwtFromRequestHeaders(action.request.headers);
        const verfiedToken = verify(token, process.env.JWT_SECRET!);
        if (!verfiedToken) {
            throw new UnauthorizedError();
        }
        const decodedToken = decodeJwt(token);
        await AppDataSource.getRepository(User).findOne({ where: { id: decodedToken.id }});
        return true;
    } catch (error) {
        throw new UnauthorizedError();
    }
}