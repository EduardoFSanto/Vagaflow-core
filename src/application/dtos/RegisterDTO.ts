import { UserRole } from '../../domain/enums/UserRole';

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}
