import { Candidate } from '../../domain/entities/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { ConflictError } from '../../domain/errors/ConflictError';
import { ValidationError } from '../../domain/errors/ValidationError';
import { randomUUID } from 'crypto';

/**
 * Create Candidate Use Case
 *
 * Business Rules:
 * - User must exist and have CANDIDATE role
 * - User can only have one candidate profile
 */
export class CreateCandidateUseCase {
  constructor(
    private candidateRepository: ICandidateRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(userId: string, resume?: string): Promise<Candidate> {
    // 1. Validate input
    if (!userId || userId.trim().length === 0) {
      throw new ValidationError('User ID is required');
    }

    // 2. Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User', userId);
    }

    // 3. Validate user role
    Candidate.validateUserRole(user);

    // 4. Check if user already has a candidate profile
    const exists = await this.candidateRepository.existsByUserId(userId);
    if (exists) {
      throw new ConflictError('User already has a candidate profile');
    }

    // 5. Create candidate entity
    const candidate = new Candidate({
      id: randomUUID(),
      userId,
      resume,
    });

    // 6. Persist candidate
    await this.candidateRepository.save(candidate);

    // 7. Return created candidate
    return candidate;
  }
}
