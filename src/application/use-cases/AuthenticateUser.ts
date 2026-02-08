import { User } from '../../domain/entities/User';
import { UnauthorizedError } from '../../domain/errors/UnauthorizedError';
import { ValidationError } from '../../domain/errors/ValidationError';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Email } from '../../domain/value-objects/Email';
import { LoginDTO } from '../dtos/LoginDTO';

/**
 * Authenticate User Use Case
 *
 * Business Rules:
 * - User must exist
 * - Password must match
 * - Returns user if credentials are valid
 */
export class AuthenticateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: LoginDTO): Promise<User> {
    // 1. Validate input
    this.validateInput(dto);

    // 2. Create Email value object
    const email = new Email(dto.email);

    // 3. Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // 4. Validate password
    const isPasswordValid = await user.validatePassword(dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // 5. Return authenticated user
    return user;
  }

  private validateInput(dto: LoginDTO): void {
    if (!dto.email || dto.email.trim().length === 0) {
      throw new ValidationError('Email is required');
    }

    if (!dto.password || dto.password.trim().length === 0) {
      throw new ValidationError('Password is required');
    }
  }
}
