import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ValidationError } from '../../../domain/errors/ValidationError';
import { ConflictError } from '../../../domain/errors/ConflictError';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';

/**
 * Global error handler for Fastify
 */
export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  _reply: FastifyReply,
) {
  console.error('Error caught by errorHandler:', {
    type: error.constructor.name,
    message: error.message,
    statusCode: error.statusCode || 500,
  });

  // ValidationError -> 400 Bad Request
  if (error instanceof ValidationError) {
    return _reply.status(400).send({
      error: 'Bad Request',
      message: error.message,
    });
  }

  // UnauthorizedError -> 401 Unauthorized
  if (error instanceof UnauthorizedError) {
    return _reply.status(401).send({
      error: 'Unauthorized',
      message: error.message,
    });
  }

  // NotFoundError -> 404 Not Found
  if (error instanceof NotFoundError) {
    return _reply.status(404).send({
      error: 'Not Found',
      message: error.message,
    });
  }

  // ConflictError -> 409 Conflict
  if (error instanceof ConflictError) {
    return _reply.status(409).send({
      error: 'Conflict',
      message: error.message,
    });
  }

  // Default: 500 Internal Server Error
  return _reply.status(error.statusCode || 500).send({
    error: 'Internal Server Error',
    message: error.message || 'Something went wrong',
  });
}