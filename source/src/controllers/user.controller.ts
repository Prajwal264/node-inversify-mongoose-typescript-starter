import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  interfaces, controller, request, response, httpPost,
} from 'inversify-express-utils';
import { decode } from 'jsonwebtoken';
import { RequestWithContext } from '../types/request.type';
import { AuthService } from '../services/auth.service';
import TYPES from '../types';

@controller('/auth')
export class AuthController implements interfaces.Controller {
  constructor(
    @inject(TYPES.AuthService) readonly authService: AuthService,
  ) {}

  @httpPost('/register')
  public async signup(@request() req: Request, @response() res: Response) {
    const { email, password } = req.body;
    try {
      if (!email) {
        throw Error('Email is mandatory');
      }
      if (!password) {
        throw Error('Password is mandatory');
      }
      await this.authService.create({
        email,
        password,
      });
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  @httpPost('/verify')
  public async login(@request() req: Request, @response() res: Response) {
    const { email, password } = req.body;
    try {
      if (!email) {
        throw Error('Email is mandatory');
      }
      if (!password) {
        throw Error('Password is mandatory');
      }
      const verifiedResponse = await this.authService.verify({
        email,
        password,
      });
      res.status(200).json(verifiedResponse);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  @httpPost('/refreshtoken')
  public async refreshToken(@request() req: RequestWithContext, @response() res: Response) {
    const { refreshToken } = req.body;
    const bearer = req.headers.authorization;
    try {
      if (!bearer) {
        throw new Error('Invalid access token');
      }
      const token = bearer.split(' ')[1];
      const decodedToken: any = decode(token);
      if (!decodedToken) {
        throw new Error('Invalid access token');
      }
      const accessToken = await this.authService.refresh(decodedToken.userId, refreshToken);
      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
