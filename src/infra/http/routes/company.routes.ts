import { FastifyInstance } from 'fastify';
import { CompanyController } from '../controllers/CompanyController';
import { authMiddleware } from '../middlewares/authMiddleware';

export async function companyRoutes(fastify: FastifyInstance) {
  const controller = new CompanyController();

  // Protected route - only authenticated companies can create company profile
  fastify.post(
    '/companies',
    {
      preHandler: [authMiddleware],
    },
    controller.create.bind(controller)
  );
}
