import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import config from '../config/index.mjs';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT.sercetKey,
};

passport.use(new Strategy(options, async (jwtPayload, done) => {
  if (jwtPayload.user) return done(null, jwtPayload.user);
  return done(null, false);
}));

const authMiddleware = passport.authenticate('jwt', { session: false });

export default authMiddleware;