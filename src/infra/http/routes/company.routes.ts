import { FastifyInstance } from 'fastify';
import { CompanyController } from '../controllers/CompanyController';

export async function companyRoutes(fastify: FastifyInstance) {
  const controller = new CompanyController();

  fastify.post('/companies', controller.create.bind(controller));
}
