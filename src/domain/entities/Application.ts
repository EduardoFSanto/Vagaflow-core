import {
  ApplicationStatus,
  canTransitionStatus,
} from '../enums/ApplicationStatus';

/**
 * Application Entity (Aggregate Root)
 *
 * Represents a candidate's application to a job vacancy.
 *
 * Business Rules:
 * - Must have a Candidate and a Job
 * - Starts as PENDING
 * - Only COMPANY can change status (accept/reject)
 * - Once ACCEPTED or REJECTED, status is final (immutable)
 * - A candidate cannot apply twice to the same job (enforced by use case)
 */
export class Application {
  private readonly id: string;
  private readonly candidateId: string;
  private readonly jobId: string;
  private status: ApplicationStatus;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: {
    id: string;
    candidateId: string;
    jobId: string;
    status?: ApplicationStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.validate(props);

    this.id = props.id;
    this.candidateId = props.candidateId;
    this.jobId = props.jobId;
    this.status = props.status ?? ApplicationStatus.PENDING;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  /**
   * Validate application properties
   */
  private validate(props: {
    id: string;
    candidateId: string;
    jobId: string;
  }): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Application ID cannot be empty');
    }

    if (!props.candidateId || props.candidateId.trim().length === 0) {
      throw new Error('Candidate ID cannot be empty');
    }

    if (!props.jobId || props.jobId.trim().length === 0) {
      throw new Error('Job ID cannot be empty');
    }
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getCandidateId(): string {
    return this.candidateId;
  }

  public getJobId(): string {
    return this.jobId;
  }

  public getStatus(): ApplicationStatus {
    return this.status;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods

  /**
   * Check if application is pending
   */
  public isPending(): boolean {
    return this.status === ApplicationStatus.PENDING;
  }

  /**
   * Check if application is accepted
   */
  public isAccepted(): boolean {
    return this.status === ApplicationStatus.ACCEPTED;
  }

  /**
   * Check if application is rejected
   */
  public isRejected(): boolean {
    return this.status === ApplicationStatus.REJECTED;
  }

  /**
   * Check if status is final (cannot be changed)
   */
  public isFinal(): boolean {
    return this.isAccepted() || this.isRejected();
  }

  /**
   * Accept the application
   *
   * Business Rule: Only COMPANY can call this (enforced by use case)
   *
   * @throws Error if status transition is not allowed
   */
  public accept(): void {
    if (!canTransitionStatus(this.status, ApplicationStatus.ACCEPTED)) {
      throw new Error(`Cannot accept application with status ${this.status}`);
    }

    this.status = ApplicationStatus.ACCEPTED;
    this.updatedAt = new Date();
  }

  /**
   * Reject the application
   *
   * Business Rule: Only COMPANY can call this (enforced by use case)
   *
   * @throws Error if status transition is not allowed
   */
  public reject(): void {
    if (!canTransitionStatus(this.status, ApplicationStatus.REJECTED)) {
      throw new Error(`Cannot reject application with status ${this.status}`);
    }

    this.status = ApplicationStatus.REJECTED;
    this.updatedAt = new Date();
  }

  /**
   * Check if this application belongs to a specific candidate
   */
  public belongsToCandidate(candidateId: string): boolean {
    return this.candidateId === candidateId;
  }

  /**
   * Check if this application is for a specific job
   */
  public isForJob(jobId: string): boolean {
    return this.jobId === jobId;
  }

  /**
   * Check equality by ID
   */
  public equals(other: Application): boolean {
    return this.id === other.id;
  }
}
