import { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';

/**
 * JWT Payload Interface
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Custom FastifyRequest with typed JWT user
 */
export interface AuthenticatedRequest extends FastifyRequest {
  user: JWTPayload;
}

/**
 * Authentication Middleware
 *
 * Validates JWT token and attaches user data to request.
 * Throws UnauthorizedError if token is missing or invalid.
 */
export async function authMiddleware(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  try {
    // Verify JWT token (automatically extracts from Authorization header)
    await request.jwtVerify();

    // Token is valid, user data is now available in request.user
  } catch (error) {
    throw new UnauthorizedError('Invalid or missing authentication token');
  }
}

/**
 * Type guard to check if request is authenticated
 * Use this in controllers to get typed access to user data
 *
 * @example
 * if (isAuthenticatedRequest(request)) {
 *   console.log(request.user.userId); // ✅ TypeScript happy
 * }
 */
export function isAuthenticatedRequest(
  request: FastifyRequest
): request is AuthenticatedRequest {
  return 'user' in request && request.user !== undefined;
}
