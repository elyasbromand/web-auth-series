// Level 4: Sessions and Cookies
// To use this code, align it with your project configuration
// This level is in great security level which can be used in many systems

//express-session setup
app.use(
  session({
    secret: "Your_SECRET", // Use .env in production
    resave: false,
    saveUninitialized: true,
  })
);

//passport.js middleware initialization
app.use(passport.initialize());
app.use(passport.session());

//passport-local Strategy
passport.use(
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [username]);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;

        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) return cb(err);
          if (valid) return cb(null, user);
          else return cb(null, false);
        });
      } else {
        return cb(null, false); // User not found
      }
    } catch (err) {
      return cb(err);
    }
  })
);

//Serialize and Deserialize User
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

//login route using passport.authenticate
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

//protected route example
app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets.ejs");
  } else {
    res.redirect("/login");
  }
});

