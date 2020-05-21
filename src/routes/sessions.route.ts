import { Router } from 'express';

import AutenthicateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticateUser = new AutenthicateUserService();

  const { user, token } = await authenticateUser.execute({
    email,
    password,
  });

  // remove o campo password do retorno
  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
