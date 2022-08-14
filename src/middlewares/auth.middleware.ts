import * as express from 'express';
import { AuthService } from '../services/auth.service';
import TYPES from '../types';
import container from '../inversify.cofig';
import { getUserIdByAuthorizationBearer, verifyAccessToken } from '../helpers/token.helper';

function authMiddlewareFactory() {
  return () => async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authService = container.get<AuthService>(TYPES.AuthService);

    const token = req.headers.authorization as string;
    if (token) {
      const accessToken = token.split(' ')[1];
      if (!accessToken) {
        res.status(401).json({
          status: 'Forbidden',
        }).end();
        return;
      }
      try {
        verifyAccessToken(accessToken);
      } catch (e) {
        res.status(403).json({
          status: 'Unauthorized',
        }).end();
        return;
      }
      const id = await getUserIdByAuthorizationBearer(token);
      if (id) {
        const user = await authService.getById(id);
        if (!user) {
          res.status(403).json({
            status: 'Unauthorized',
          }).end();
          return;
        }
        (req as any).user = user;
        next();
        return;
      }
    }
    res.status(401).json({
      status: 'Forbidden',
    }).end();
  };
}

const authMiddleware = authMiddlewareFactory();

export { authMiddleware };
