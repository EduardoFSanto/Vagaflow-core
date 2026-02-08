import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterUserUseCase } from '../../../application/use-cases/RegisterUser';
import { AuthenticateUserUseCase } from '../../../application/use-cases/AuthenticateUser';
import { PrismaUserRepository } from '../../repositories/PrismaUserRepository';
import { prisma } from '../../database/prisma/client';
import { UserRole } from '../../../domain/enums/UserRole';
import { z } from 'zod';

/**
 * Auth Controller
 *
 * Handles authentication and registration endpoints
 */
export class AuthController {
  /**
   * POST /auth/register
   * Register a new user
   */
  static async register(request: FastifyRequest, reply: FastifyReply) {
    // Validate request body
    const registerSchema = z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      name: z.string().min(2, 'Name must be at least 2 characters'),
      role: z.nativeEnum(UserRole, {
        errorMap: () => ({ message: 'Role must be CANDIDATE or COMPANY' }),
      }),
    });

    const data = registerSchema.parse(request.body);

    // Execute use case
    const userRepository = new PrismaUserRepository(prisma);
    const registerUserUseCase = new RegisterUserUseCase(userRepository);

    const user = await registerUserUseCase.execute(data);

    // Generate JWT token
    const token = request.server.jwt.sign({
      userId: user.getId(),
      email: user.getEmail().getValue(),
      role: user.getRole(),
    });

    // Return user data and token
    return reply.status(201).send({
      user: {
        id: user.getId(),
        email: user.getEmail().getValue(),
        name: user.getName(),
        role: user.getRole(),
      },
      token,
    });
  }

  /**
   * POST /auth/login
   * Authenticate user and return JWT token
   */
  static async login(request: FastifyRequest, reply: FastifyReply) {
    // Validate request body
    const loginSchema = z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(1, 'Password is required'),
    });

    const data = loginSchema.parse(request.body);

    // Execute use case
    const userRepository = new PrismaUserRepository(prisma);
    const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);

    const user = await authenticateUserUseCase.execute(data);

    // Generate JWT token
    const token = request.server.jwt.sign({
      userId: user.getId(),
      email: user.getEmail().getValue(),
      role: user.getRole(),
    });

    // Return user data and token
    return reply.status(200).send({
      user: {
        id: user.getId(),
        email: user.getEmail().getValue(),
        name: user.getName(),
        role: user.getRole(),
      },
      token,
    });
  }
}
