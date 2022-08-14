import { Container } from 'inversify';
import TYPES from './types';
import { AuthService } from './services/auth.service';

const container = new Container();

container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();

export default container;
