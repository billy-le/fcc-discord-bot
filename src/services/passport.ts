import passport from "passport";
import mongoose from "mongoose";
import { Strategy as GithubStrategy } from "passport-github";

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL
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

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID as string,
      clientSecret: GITHUB_CLIENT_SECRET as string,
      callbackURL: GITHUB_CALLBACK_URL as string
    },
    async (accessToken, refreshToken, profile, done) => {
      // This is where the user is redirected after authenticating
      try {
        const existingUser = await User.findOne({ githubId: profile.id });

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
    }
  )
);
