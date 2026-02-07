import { JobStatus } from '../enums/JobStatus';
import { JobTitle } from '../value-objects/JobTitle';

/**
 * Job Entity
 *
 * Represents a job vacancy posted by a company.
 *
 * Business Rules:
 * - Must belong to a Company
 * - Title is required (uses JobTitle value object)
 * - Starts as OPEN by default
 * - Only the owning Company can change status
 * - CLOSED jobs don't accept new applications
 */
export class Job {
  private readonly id: string;
  private readonly companyId: string;
  private title: JobTitle;
  private description: string;
  private status: JobStatus;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: {
    id: string;
    companyId: string;
    title: JobTitle;
    description: string;
    status?: JobStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.validate(props);

    this.id = props.id;
    this.companyId = props.companyId;
    this.title = props.title;
    this.description = props.description;
    this.status = props.status ?? JobStatus.OPEN;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  /**
   * Validate job properties
   */
  private validate(props: {
    id: string;
    companyId: string;
    title: JobTitle;
    description: string;
  }): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Job ID cannot be empty');
    }

    if (!props.companyId || props.companyId.trim().length === 0) {
      throw new Error('Company ID cannot be empty');
    }

    if (!props.description || props.description.trim().length === 0) {
      throw new Error('Job description cannot be empty');
    }

    if (props.description.trim().length < 10) {
      throw new Error('Job description must be at least 10 characters');
    }

    if (props.description.trim().length > 5000) {
      throw new Error('Job description cannot exceed 5000 characters');
    }
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getCompanyId(): string {
    return this.companyId;
  }

  public getTitle(): JobTitle {
    return this.title;
  }

  public getDescription(): string {
    return this.description;
  }

  public getStatus(): JobStatus {
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
   * Check if job is open for applications
   */
  public isOpen(): boolean {
    return this.status === JobStatus.OPEN;
  }

  /**
   * Check if job is closed
   */
  public isClosed(): boolean {
    return this.status === JobStatus.CLOSED;
  }

  /**
   * Close the job (no longer accepts applications)
   */
  public close(): void {
    if (this.isClosed()) {
      throw new Error('Job is already closed');
    }

    this.status = JobStatus.CLOSED;
    this.updatedAt = new Date();
  }

  /**
   * Reopen the job
   */
  public reopen(): void {
    if (this.isOpen()) {
      throw new Error('Job is already open');
    }

    this.status = JobStatus.OPEN;
    this.updatedAt = new Date();
  }

  /**
   * Update job title
   */
  public updateTitle(newTitle: JobTitle): void {
    this.title = newTitle;
    this.updatedAt = new Date();
  }

  /**
   * Update job description
   */
  public updateDescription(newDescription: string): void {
    if (!newDescription || newDescription.trim().length === 0) {
      throw new Error('Job description cannot be empty');
    }

    if (newDescription.trim().length < 10) {
      throw new Error('Job description must be at least 10 characters');
    }

    if (newDescription.trim().length > 5000) {
      throw new Error('Job description cannot exceed 5000 characters');
    }

    this.description = newDescription.trim();
    this.updatedAt = new Date();
  }

  /**
   * Check if this job belongs to a specific company
   */
  public belongsToCompany(companyId: string): boolean {
    return this.companyId === companyId;
  }

  /**
   * Check equality by ID
   */
  public equals(other: Job): boolean {
    return this.id === other.id;
  }
}
