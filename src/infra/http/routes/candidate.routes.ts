import { FastifyInstance } from 'fastify';
import { CandidateController } from '../controllers/CandidateController';

export async function candidateRoutes(fastify: FastifyInstance) {
  const controller = new CandidateController();

  fastify.post('/candidates', controller.create.bind(controller));
}
