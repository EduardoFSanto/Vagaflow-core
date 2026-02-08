import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { DomainError } from '../../../domain/errors/DomainError';
import { ValidationError } from '../../../domain/errors/ValidationError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { ConflictError } from '../../../domain/errors/ConflictError';

/**
 * Global Error Handler Middleware
 *
 * Converts domain errors to appropriate HTTP responses
 */
export async function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  // Domain errors
  if (error instanceof ValidationError) {
    return reply.status(400).send({
      error: 'Validation Error',
      message: error.message,
    });
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(403).send({
      error: 'Unauthorized',
      message: error.message,
    });
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({
      error: 'Not Found',
      message: error.message,
    });
  }

  if (error instanceof ConflictError) {
    return reply.status(409).send({
      error: 'Conflict',
      message: error.message,
    });
  }

  if (error instanceof DomainError) {
    return reply.status(400).send({
      error: 'Domain Error',
      message: error.message,
    });
  }

  // Fastify validation errors
  if (error.validation) {
    return reply.status(400).send({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: error.validation,
    });
  }

  // Unknown errors (bugs)
  console.error('Unexpected error:', error);

  return reply.status(500).send({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
}
