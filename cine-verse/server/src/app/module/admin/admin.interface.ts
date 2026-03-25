import { UserStatus } from "../../../generated/prisma/enums.js";


export interface IAdminUpdate {
  name: string;
  profilePhoto?: string;
  description?: string;
  contactNumber?: string;
  status?: UserStatus;
}
