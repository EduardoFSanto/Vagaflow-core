import { User } from './User';

/**
 * Company Entity
 *
 * Represents a company that posts job vacancies.
 *
 * Business Rules:
 * - Must be associated with a User that has COMPANY role
 * - Can create and manage job vacancies
 * - Can accept/reject applications to their jobs
 * - Company name is required and editable
 */
export class Company {
  private readonly id: string;
  private readonly userId: string;
  private companyName: string;
  private description: string;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: {
    id: string;
    userId: string;
    companyName: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.validate(props);

    this.id = props.id;
    this.userId = props.userId;
    this.companyName = props.companyName;
    this.description = props.description ?? '';
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  /**
   * Validate company properties
   */
  private validate(props: {
    id: string;
    userId: string;
    companyName: string;
  }): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Company ID cannot be empty');
    }

    if (!props.userId || props.userId.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }

    if (!props.companyName || props.companyName.trim().length === 0) {
      throw new Error('Company name cannot be empty');
    }

    if (props.companyName.trim().length < 2) {
      throw new Error('Company name must be at least 2 characters');
    }

    if (props.companyName.trim().length > 100) {
      throw new Error('Company name cannot exceed 100 characters');
    }
  }

  /**
   * Validate that user has COMPANY role
   * This should be called by the use case before creating a Company
   */
  public static validateUserRole(user: User): void {
    if (!user.isCompany()) {
      throw new Error(
        'Only users with COMPANY role can create a company profile'
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

  public getCompanyName(): string {
    return this.companyName;
  }

  public getDescription(): string {
    return this.description;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods

  /**
   * Update company name
   */
  public updateCompanyName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Company name cannot be empty');
    }

    if (newName.trim().length < 2) {
      throw new Error('Company name must be at least 2 characters');
    }

    if (newName.trim().length > 100) {
      throw new Error('Company name cannot exceed 100 characters');
    }

    this.companyName = newName.trim();
    this.updatedAt = new Date();
  }

  /**
   * Update company description
   */
  public updateDescription(newDescription: string): void {
    if (newDescription && newDescription.length > 1000) {
      throw new Error('Description cannot exceed 1000 characters');
    }

    this.description = newDescription?.trim() ?? '';
    this.updatedAt = new Date();
  }

  /**
   * Check if this company belongs to a specific user
   */
  public belongsToUser(userId: string): boolean {
    return this.userId === userId;
  }

  /**
   * Check equality by ID
   */
  public equals(other: Company): boolean {
    return this.id === other.id;
  }
}
