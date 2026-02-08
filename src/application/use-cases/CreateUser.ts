import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Email } from '../../domain/value-objects/Email';
import { ConflictError } from '../../domain/errors/ConflictError';
import { ValidationError } from '../../domain/errors/ValidationError';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { randomUUID } from 'crypto';

/**
 * Create User Use Case
 *
 * Business Rules:
 * - Email must be unique
 * - Role must be CANDIDATE or COMPANY
 */
export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: CreateUserDTO): Promise<User> {
    // 1. Validate input
    this.validateInput(dto);

    // 2. Create Email value object (validates format)
    const email = new Email(dto.email);

    // 3. Check if email already exists
    const emailExists = await this.userRepository.existsByEmail(email);
    if (emailExists) {
      throw new ConflictError('Email already registered');
    }

    // 4. Create user entity
    const user = new User({
      id: randomUUID(),
      email,
      name: dto.name,
      role: dto.role,
    });

    // 5. Persist user
    await this.userRepository.save(user);

    // 6. Return created user
    return user;
  }

  private validateInput(dto: CreateUserDTO): void {
    if (!dto.email || dto.email.trim().length === 0) {
      throw new ValidationError('Email is required');
    }

    if (!dto.name || dto.name.trim().length === 0) {
      throw new ValidationError('Name is required');
    }

    if (!dto.role) {
      throw new ValidationError('Role is required');
    }

    if (!dto.password || dto.password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }
  }
}
