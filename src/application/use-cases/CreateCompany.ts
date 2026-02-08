import { Company } from '../../domain/entities/Company';
import { ICompanyRepository } from '../../domain/repositories/ICompanyRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { ConflictError } from '../../domain/errors/ConflictError';
import { ValidationError } from '../../domain/errors/ValidationError';
import { randomUUID } from 'crypto';

/**
 * Create Company Use Case
 *
 * Business Rules:
 * - User must exist and have COMPANY role
 * - User can only have one company profile
 */
export class CreateCompanyUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(
    userId: string,
    companyName: string,
    description?: string
  ): Promise<Company> {
    // 1. Validate input
    this.validateInput(userId, companyName);

    // 2. Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User', userId);
    }

    // 3. Validate user role
    Company.validateUserRole(user);

    // 4. Check if user already has a company profile
    const exists = await this.companyRepository.existsByUserId(userId);
    if (exists) {
      throw new ConflictError('User already has a company profile');
    }

    // 5. Create company entity
    const company = new Company({
      id: randomUUID(),
      userId,
      companyName,
      description,
    });

    // 6. Persist company
    await this.companyRepository.save(company);

    // 7. Return created company
    return company;
  }

  private validateInput(userId: string, companyName: string): void {
    if (!userId || userId.trim().length === 0) {
      throw new ValidationError('User ID is required');
    }

    if (!companyName || companyName.trim().length === 0) {
      throw new ValidationError('Company name is required');
    }
  }
}
