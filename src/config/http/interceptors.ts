import { Action, UnauthorizedError } from "routing-controllers";
import { verify } from "jsonwebtoken";
import { decodeJwt, getJwtFromRequestHeaders } from "../../utils/jwt";
import { AppDataSource } from "../database/data-source";
import { User } from "../../entities/user.entity";
import UserRole from "../../common/enums/userRole.enum";

export const authorizationInterceptor = async (
  action: Action,
  roles: string[] = []
) => {
  try {
    const token = getJwtFromRequestHeaders(action.request.headers);
    if (!token) {
        throw new UnauthorizedError();
    }
    const verfiedToken = verify(token, process.env.JWT_SECRET!);
    if (!verfiedToken) {
      throw new UnauthorizedError("Invalid access token");
    }
    const decodedUserToken = decodeJwt(token);
    if (
      roles.includes(UserRole.ADMIN) &&
      decodedUserToken.role !== UserRole.ADMIN
    ) {
      throw new UnauthorizedError("Invalid user role");
    }
    await AppDataSource.getRepository(User).findOneByOrFail({
      id: decodedUserToken.id,
    });
    return true;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError();
  }
};

export const currentUserInterceptor = async (action: Action) => {
  try {
    const token = getJwtFromRequestHeaders(action.request.headers);
    const decodedUserToken = decodeJwt(token);
    return await AppDataSource.getRepository(User).findOneByOrFail({
      id: decodedUserToken.id,
    });
  } catch (error) {
    throw new UnauthorizedError();
  }
};
