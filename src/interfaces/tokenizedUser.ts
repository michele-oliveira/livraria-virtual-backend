import UserRole from "../common/enums/userRole.enum";

export default interface TokenizedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
