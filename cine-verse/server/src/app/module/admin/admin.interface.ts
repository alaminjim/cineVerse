import { UserStatus } from "../../../generated/prisma/enums";

export interface IAdminUpdate {
  name: string;
  profilePhoto?: string;
  description?: string;
  contactNumber?: string;
  status?: UserStatus;
}
