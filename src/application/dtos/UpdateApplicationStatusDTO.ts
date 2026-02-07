import { ApplicationStatus } from '../../domain/enums/ApplicationStatus';

/**
 * DTO for updating application status
 */
export interface UpdateApplicationStatusDTO {
  applicationId: string;
  status: ApplicationStatus;
  companyId: string; // For authorization
}
