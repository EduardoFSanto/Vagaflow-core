/**
 * Pagination Query Parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Pagination Metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Validate and sanitize pagination params
 */
export function validatePaginationParams(
  page?: number,
  limit?: number
): PaginationParams {
  // Default values
  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 10;
  const MAX_LIMIT = 100;

  // Validate page
  const validPage = page && page > 0 ? Math.floor(page) : DEFAULT_PAGE;

  // Validate limit
  let validLimit = limit && limit > 0 ? Math.floor(limit) : DEFAULT_LIMIT;
  validLimit = Math.min(validLimit, MAX_LIMIT); // Cap at max

  return {
    page: validPage,
    limit: validLimit,
  };
}
