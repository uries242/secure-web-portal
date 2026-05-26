const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails && profile.emails[0]
            ? profile.emails[0].value
            : null;

        // 1. Already linked via githubId
        let user = await User.findOne({ githubId: profile.id });
        if (user) return done(null, user);

        // 2. Same email exists — link the accounts
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.githubId = profile.id;
            user.displayName = user.displayName || profile.displayName;
            await user.save();
            return done(null, user);
          }
        }

        // 3. Brand new user — create them
        user = await User.create({
          githubId: profile.id,
          email: email,
          displayName: profile.displayName,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;