// Level 6: OAuth with Google
// This level implements OAuth authentication with Google
// Using dotenv to secure sensitive data

import env from "dotenv";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";



app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/calback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log("Google profile:", profile);
      try {
        const email = profile.email;
        const checkResult = await db.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        if (checkResult.rows.length === 0) {
          // User not found, create a new user
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, "google-oauth"]
          );
          const user = result.rows[0];
          return cb(null, user);
        } else {
          // User already exists, return the user
          const user = checkResult.rows[0];
          return cb(null, user);
        }
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);