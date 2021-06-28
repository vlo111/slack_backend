import jwt from 'jsonwebtoken';
import HttpErrors from 'http-errors';
import url from 'url';

const { JWT_SECRET } = process.env;

const EXCLUDE = [
  'POST:/users/sign-in',
  'POST:/users/sign-up',
  'GET:/users/oauth/v2/*',
];

function authorize(req, res, next) {
  try {
    const {
      headers: {
        authorization,
      },
      ip,
      method,
    } = req;
    if (method === 'OPTIONS') {
      next();
      return;
    }
    const { pathname } = url.parse(req.url);
    const exclude = EXCLUDE.some((exc) => {
      if (exc.includes('*')) {
        return `${method}:${pathname}`.startsWith(exc.replace('*', ''));
      }
      return exc === `${method}:${pathname}`;
    });
    if (exclude) {
      next();
      return;
    }
    if (!authorization) {
      throw new HttpErrors(401, 'Authorization key is required');
    }
    const token = authorization.replace('Bearer ', '');
    let userId;
    let userIP;
    try {
      const data = jwt.verify(token, JWT_SECRET);
      userId = data.userId;
      userIP = data.userIP;
    } catch (e) {
      //
    }
    if (!userId) {
      throw new HttpErrors(401, 'Invalid authorization key');
    }

    if (userIP && userIP !== ip) {
      throw new HttpErrors(401, 'Invalid authorization key');
    }

    req.userId = userId;
    global.userId = userId;

    next();
  } catch (e) {
    next(e);
  }
}

export default authorize;
