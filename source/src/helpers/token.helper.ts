import jwt, { decode, JwtPayload, SignOptions } from 'jsonwebtoken';

// TODO: move this to env
const accessTokenSecret = '10';
const refreshTokenSecret = '12';
const rememberMeTokenSecret = '14';
const resetPasswordToken = '14';

/**
 *
 *
 * @param {*} payload
 * @param {*} secret
 * @param {*} [expiresIn=undefined]
 * @return {*}
 */
const createToken: (
  payload: any, secret: string, expiresIn?: string
) => string = (payload, secret, expiresIn = undefined) => {
  const jwtOptions = {} as SignOptions;
  if (expiresIn) jwtOptions.expiresIn = expiresIn;
  return jwt.sign(payload, secret, jwtOptions);
};

/**
 * creates a new access token
 *
 * @return {*}
 */
export const createAccessToken: (
  payload: any, expiresIn: string
) => string = (payload, expiresIn) => createToken(payload, accessTokenSecret, expiresIn);

/**
 * creates a new refresh token
 *
 * @return {*}
 */
export const createRefreshToken: (
  payload: any, expiresIn?: string
) => string = (
  payload,
  expiresIn = undefined,
) => createToken(payload, refreshTokenSecret, expiresIn);

/**
 * creates a new remember me token
 *
 * @return {*}
 */
export const createRememberMeToken: (
  p: any, t?: string
) => string = (
  payload,
  expiresIn = undefined,
) => createToken(payload, rememberMeTokenSecret, expiresIn);

/**
 * creates a new reset password token
 *
 * @return {*}
 */
export const createResetPasswordToken: (
  p: any, t?: string
) => string = (
  payload,
  expiresIn = undefined,
) => createToken(payload, resetPasswordToken, expiresIn);

/**
 * verifies the token
 *
 * @param {*} token
 * @param {*} secret
 * @return {*}
 */
const verifyToken: (t: string, s: string) => string | JwtPayload = (
  token,
  secret,
) => jwt.verify(token, secret);

/**
 * verifies the acess token
 *
 * @param {*} token
 * @return {*}
 */
export const verifyAccessToken: (t: string) => string | JwtPayload = (
  token,
) => verifyToken(token, accessTokenSecret);

/**
 * verifies the refresh token
 *
 * @param {*} token
 * @return {*}
 */
export const verifyRefreshToken: (t: string) => string | JwtPayload = (
  token,
) => verifyToken(token, refreshTokenSecret);

/**
 * verifies the remember me token
 *
 * @param {*} token
 * @return {*}
 */
export const verifyRememberMeToken: (t: string) => string | JwtPayload = (
  token,
) => verifyToken(token, rememberMeTokenSecret);

/**
 * verifies the reset password token
 *
 * @param {*} token
 * @return {*}
 */
export const verifyResetPasswordToken: (t: string) => string | JwtPayload = (
  token,
) => verifyToken(token, resetPasswordToken);

/**
 *
 *
 * @param {*} bearer
 * @return {*}
 */
export const getUserIdByAuthorizationBearer: (b: string) => string = (bearer) => {
  if (bearer) {
    const token = bearer.split(' ')[1];
    const decodedToken: any = decode(token);
    if (decodedToken) return decodedToken.userId;
    return null;
  }
  return null;
};
