import passport from "passport";
import mongoose from "mongoose";
import { Strategy as GithubStrategy } from "passport-github";
// import GithubTokenStrategy from 'passport-github-token';
const GithubTokenStrategy = require('passport-github-token');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL,
  COOKIE_KEY // TODO: Change to token key later
} = process.env;

// Don't use require with Mongoose model classes, you can pull it out from Mongoose
const User = mongoose.model("users");

// "user" is the user returned from the DB
passport.serializeUser((user: any, done: any) => {
  // user.id is not the profile id, but the Mongo id
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.log("Error:", err);
  }
});

// passport.use(
//   new GithubStrategy(
//     {
//       clientID: GITHUB_CLIENT_ID as string,
//       clientSecret: GITHUB_CLIENT_SECRET as string,
//       callbackURL: GITHUB_CALLBACK_URL as string
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       // This is where the user is redirected after authenticating
// try {
//   const existingUser = await User.findOne({ githubId: profile.id });

//   if (existingUser) {
//     done(null, existingUser);
//   } else {
//     try {
//       const user = await new User({
//         githubId: profile.id,
//         username: profile.username,
//         displayName: profile.displayName
//       }).save();
//       done(null, user);
//     } catch (err) {
//       console.log("Error:", err);
//     }
//   }
// } catch (err) {
//   console.log("Error:", err);
// }
//     }
//   )
// );

passport.use(new GithubTokenStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  passReqToCallback: true
}, async (req: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
  try {
    const existingUser = await User.findOne({ githubId: profile.id });
    console.log('existingUser:', existingUser);
    
    if (existingUser) {
      done(null, existingUser);
    } else {
      try {
        const user = await new User({
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName
        }).save();
        done(null, user);
      } catch (err) {
        console.log("Error:", err);
      }
    }
  } catch (err) {
    console.log("Error:", err);
  }
}));

// Helper functions for JWT
export const getToken = (user: any) => {
  return jwt.sign(user, COOKIE_KEY, {
    expiresIn: 3600 // expires in 1 hour
  })
};

// Defines how JWT should be extracted from the request message
let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: COOKIE_KEY
};

export const jwtPassport = passport.use(new JwtStrategy(opts,
  (jwt_payload: any, done: any) => {
    console.log("JWT Payload:", jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err: any, user: any) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));

export const verifyUser = passport.authenticate('jwt', { session: false });