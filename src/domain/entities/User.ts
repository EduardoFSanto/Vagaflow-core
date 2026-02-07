import { UserRole } from '../enums/UserRole';
import { Email } from '../value-objects/Email';

/**
 * User Entity (Aggregate Root)
 *
 * Represents a user in the system with a specific role.
 *
 * Business Rules:
 * - Every user has a unique ID
 * - Email must be unique across the system
 * - Role is immutable (cannot change after creation)
 * - Role determines permissions (CANDIDATE or COMPANY)
 */
export class User {
  private readonly id: string;
  private readonly email: Email;
  private readonly role: UserRole;
  private name: string;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: {
    id: string;
    email: Email;
    role: UserRole;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.validate(props);

    this.id = props.id;
    this.email = props.email;
    this.role = props.role;
    this.name = props.name;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  /**
   * Validate user properties
   */
  private validate(props: {
    id: string;
    email: Email;
    role: UserRole;
    name: string;
  }): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }

    if (!props.name || props.name.trim().length === 0) {
      throw new Error('User name cannot be empty');
    }

    if (props.name.trim().length < 2) {
      throw new Error('User name must be at least 2 characters');
    }

    if (props.name.trim().length > 100) {
      throw new Error('User name cannot exceed 100 characters');
    }
  }

  // Getters (imutável para ID, email, role, createdAt)
  public getId(): string {
    return this.id;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getName(): string {
    return this.name;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods

  /**
   * Check if user is a candidate
   */
  public isCandidate(): boolean {
    return this.role === UserRole.CANDIDATE;
  }

  /**
   * Check if user is a company
   */
  public isCompany(): boolean {
    return this.role === UserRole.COMPANY;
  }

  /**
   * Update user name
   */
  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }

    if (newName.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    if (newName.trim().length > 100) {
      throw new Error('Name cannot exceed 100 characters');
    }

    this.name = newName.trim();
    this.updatedAt = new Date();
  }

  /**
   * Check equality by ID
   */
  public equals(other: User): boolean {
    return this.id === other.id;
  }
}
