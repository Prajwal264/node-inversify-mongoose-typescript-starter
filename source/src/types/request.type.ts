import { Request } from 'express';
import { IUser } from '../models/user.model';

export interface RequestWithContext extends Request {
  user: IUser,
}
