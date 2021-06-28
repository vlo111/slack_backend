import md5 from 'md5';

const { USER_PASSWORD_SECRET } = process.env;

class Utils {
  static passwordHash(pass) {
    return md5(md5(pass) + USER_PASSWORD_SECRET);
  }
}

export default Utils;
