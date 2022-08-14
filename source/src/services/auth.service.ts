import { compare, hash } from 'bcrypt';
import { injectable } from 'inversify';
import { nanoid } from 'nanoid';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../helpers/token.helper';
import { IUser, User } from '../models/user.model';

interface RegisterPayload {
  email: string;
  password: string;
}

@injectable()
export class AuthService {
  private async hashPassword(password: string) {
    const hashedPassword = await hash(password, 12);
    return hashedPassword;
  }

  public async getById(id: string) {
    const user = await User.findOne({ userId: id });
    return user;
  }

  public async getByEmail(email: string) {
    const user = await User.findOne<IUser>({ email });
    return user;
  }

  public async create(payload: RegisterPayload) {
    const {
      email, password,
    } = payload;
    const userResponse = await this.getByEmail(email);
    if (userResponse) {
      throw new Error('User already exists');
    }
    const hashedPassword = await this.hashPassword(password);
    const userId = `user_${nanoid()}`;
    const user = await User.create({
      userId,
      email,
      password: hashedPassword,
    });

    return user;
  }

  private async comparePasswords(password: string, userPassword: string): Promise<boolean> {
    return compare(password, userPassword);
  }

  public async verify({
    email,
    password,
  }: {
    email: string,
    password: string,
  }) {
    const user = await this.getByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    const validUser = await this.comparePasswords(password, user.password);
    if (!validUser) {
      throw new Error('Invalid Password');
    }
    return {
      acesssToken: createAccessToken({
        userId: user.userId,
      }, '1h'),
      refreshToken: createRefreshToken({
        userId: user.userId,
      }, '7d'),
    };
  }

  public async refresh(userId: string, refreshToken: string) {
    const validToken = verifyRefreshToken(refreshToken);
    if (!validToken) {
      return null;
    }
    return createAccessToken({ userId }, '1h');
  }
}
