import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AutenthicateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AutenthicateUserService);

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    // remove o campo password do retorno
    delete user.password;

    return response.json({ user, token });
  }
}