import { UserRole } from '../../domain/enums/UserRole';

/**
 * DTO for creating a new user
 */
export interface CreateUserDTO {
  email: string;
  name: string;
  role: UserRole;
  password: string;
}
