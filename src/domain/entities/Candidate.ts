import { User } from './User';

/**
 * Candidate Entity
 *
 * Represents a candidate that applies to job vacancies.
 *
 * Business Rules:
 * - Must be associated with a User that has CANDIDATE role
 * - Can apply to multiple jobs
 * - Cannot accept/reject applications (only view their own)
 * - Resume is optional but recommended
 */
export class Candidate {
  private readonly id: string;
  private readonly userId: string;
  private resume: string;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: {
    id: string;
    userId: string;
    resume?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.validate(props);

    this.id = props.id;
    this.userId = props.userId;
    this.resume = props.resume ?? '';
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  /**
   * Validate candidate properties
   */
  private validate(props: { id: string; userId: string }): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Candidate ID cannot be empty');
    }

    if (!props.userId || props.userId.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
  }

  /**
   * Validate that user has CANDIDATE role
   */
  public static validateUserRole(user: User): void {
    if (!user.isCandidate()) {
      throw new Error(
        'Only users with CANDIDATE role can create a candidate profile'
      );
    }
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getResume(): string {
    return this.resume;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods

  /**
   * Update candidate resume
   */
  public updateResume(newResume: string): void {
    if (newResume && newResume.length > 5000) {
      throw new Error('Resume cannot exceed 5000 characters');
    }

    this.resume = newResume?.trim() ?? '';
    this.updatedAt = new Date();
  }

  /**
   * Check if this candidate belongs to a specific user
   */
  public belongsToUser(userId: string): boolean {
    return this.userId === userId;
  }

  /**
   * Check equality by ID
   */
  public equals(other: Candidate): boolean {
    return this.id === other.id;
  }
}
