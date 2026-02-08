import { randomUUID } from 'crypto';
import { User } from '../../domain/entities/User';
import { ConflictError } from '../../domain/errors/ConflictError';
import { ValidationError } from '../../domain/errors/ValidationError';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { RegisterDTO } from '../dtos/RegisterDTO';

/**
 * Register User Use Case
 *
 * Business Rules:
 * - Email must be unique
 * - Password must be hashed before storage
 * - Role must be CANDIDATE or COMPANY
 */
export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: RegisterDTO): Promise<User> {
    // 1. Validate input
    this.validateInput(dto);

    // 2. Create Email value object (validates format)
    const email = new Email(dto.email);

    // 3. Check if email already exists
    const emailExists = await this.userRepository.existsByEmail(email);
    if (emailExists) {
      throw new ConflictError('Email already registered');
    }

    // 4. Hash password
    const passwordHash = await Password.create(dto.password);

    // 5. Create user entity
    const user = new User({
      id: randomUUID(),
      email,
      passwordHash,
      name: dto.name,
      role: dto.role,
    });

    // 6. Persist user
    await this.userRepository.save(user);

    // 7. Return created user
    return user;
  }

  private validateInput(dto: RegisterDTO): void {
    if (!dto.email || dto.email.trim().length === 0) {
      throw new ValidationError('Email is required');
    }

    if (!dto.password || dto.password.trim().length === 0) {
      throw new ValidationError('Password is required');
    }

    if (!dto.name || dto.name.trim().length === 0) {
      throw new ValidationError('Name is required');
    }

    if (!dto.role) {
      throw new ValidationError('Role is required');
    }
  }
}
