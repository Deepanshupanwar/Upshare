const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
require('dotenv').config(); // Add this line to ensure .env is loaded

var opts = {}
opts.jwtFromRequest = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwthello'];
    }
    return token;
};
opts.secretOrKey = process.env.JWT_SECRET;

// Add this check
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables');
  process.exit(1);
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists in our database
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      }

      // If not, create a new user
      user = new User({
        googleId: profile.id,
        profile_pic: profile.photos[0].value,
        name: profile.displayName, // Add this line
        email: profile.emails[0].value,
        // Add any other fields you want to save
      });

      await user.save();
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
  try {
    const user = await User.findById(jwt_payload.data._id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;
