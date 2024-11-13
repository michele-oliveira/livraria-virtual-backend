import { Action, UnauthorizedError } from "routing-controllers";
import { JsonWebTokenError, verify } from "jsonwebtoken";
import { decodeJwt, getJwtFromRequestHeaders } from "../../utils/jwt";
import { AppDataSource } from "../database/data-source";
import { User } from "../../entities/user.entity";

export const authorizationInterceptor = async (
  action: Action,
  roles: string[] = []
) => {
  try {
    const token = getJwtFromRequestHeaders(action.request.headers);
    if (!token) {
      throw new UnauthorizedError("User's access token not provided");
    }

    const verifiedToken = verify(token, process.env.JWT_SECRET!);
    if (!verifiedToken) {
      throw new UnauthorizedError("Invalid access token");
    }
    
    const decodedUserToken = decodeJwt(token);
    const actualUser = await AppDataSource.getRepository(User).findOneByOrFail({
      id: decodedUserToken.id,
    });
    if (
      decodedUserToken.role !== actualUser.role ||
      (roles.length && !roles.includes(actualUser.role))
    ) {
      throw new UnauthorizedError("Invalid user role");
    }
    return true;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError("Invalid access token");
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
