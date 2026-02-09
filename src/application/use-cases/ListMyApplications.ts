import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { Application } from '../../domain/entities/Application';

/**
 * List My Applications Use Case
 *
 * Returns all applications for a specific candidate
 */
export class ListMyApplicationsUseCase {
  constructor(private applicationRepository: IApplicationRepository) {}

  async execute(candidateId: string): Promise<Application[]> {
    return await this.applicationRepository.findByCandidateId(candidateId);
  }
}
