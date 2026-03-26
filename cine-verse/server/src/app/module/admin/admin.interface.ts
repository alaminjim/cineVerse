import { UserStatus } from "@prisma/client";



export interface IAdminUpdate {
  name: string;
  profilePhoto?: string;
  description?: string;
  contactNumber?: string;
  status?: UserStatus;
}
