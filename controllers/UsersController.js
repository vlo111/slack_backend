import jwt from "jsonwebtoken";
import HttpErrors from "http-errors";
import OAuth from "../services/OAuth";
import validate from "../services/validate";
import Users from "../models/users";
import Utils from "../services/utils";

const { JWT_SECRET } = process.env;

class UsersController {
  static signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({
        email,
        password: Utils.passwordHash(password),
      }).then((user) => {
        user.password = undefined;

        return user;
      });

      if (!user) throw HttpErrors(403, "wrong email or password");

      const token = jwt.sign(
        {
          userId: user.id,
          userIP: req.ip,
          loginService: "native",
        },
        JWT_SECRET
      );

      res.json({
        status: "ok",
        token,
        user,
      });
    } catch (e) {
      next(e);
    }
  };

  static signUp = async (req, res, next) => {
    try {
      await validate(req.body, {
        email: "required|email",
        firstName: "required|alpha",
        lastName: "required|alpha",
        password: "required|minLength:5",
        confirmPassword: 'required|minLength:5|same:password'
      });

      const { firstName, lastName, email, password } = req.body;

      const userExists = await Users.findOne({ email });

      if (userExists) throw HttpErrors(403, "Account already exists");

      const users = new Users({
        email,
        firstName,
        lastName,
        password: Utils.passwordHash(password),
      });

      users.save().then((user) => {
        user.password = undefined;
        res.json({
          status: "ok",
          user,
        });
      });
    } catch (e) {
      next(e);
    }
  };

  static redirectGoogle = async (req, res, next) => {
    try {
      await validate(req.query, {
        accessToken: "required",
      });

      const { accessToken } = req.query;

      const profileData = await OAuth.v2.Google.getProfile(accessToken);

      if (profileData.verified_email === false) {
        throw new HttpErrors(403, "Your google account email not verified!");
      }

      let user = await Users.findOne({
        email: profileData.email
      });

      if (!user) {
        user = new Users({
          firstName: profileData.given_name,
          lastName: profileData.family_name,
          email: profileData.email,
        });

        await user.save();
      }

      const token = jwt.sign(
        {
          userId: user.id,
          userIP: req.ip,
          loginService: "google",
        },
        JWT_SECRET
      );

      if (!token) throw new HttpErrors(403, "Login fail!");

      res.json({
        status: "ok",
        token,
        user,
      });
    } catch (e) {
      next(e);
    }
  };

  static current   = async (req, res, next) => {
    try {
      const user = await Users.findById(req.userId);

      if (!user) throw HttpErrors(404);

      res.json({
        status: 'ok',
        user,
      });
    } catch (e) {
      next(e);
    }
  };
}

export default UsersController;
