const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const connectToMongoDB = require('../models/usersdb'); // Adjust the path as needed

module.exports = (passport) => {
  passport.use(
  new GoogleStrategy(
    {
      clientID: '634272954176-8lv8drl1occbs905bd3655frjil9smq4.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/callback', 
    },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const client = await connectToMongoDB();
          const db = client.db();
          const usersCollection = db.collection('users');

          const existingUser = await usersCollection.findOne({ email: profile._json.email });

          if (!existingUser) {
            await usersCollection.insertMany([{ username: profile._json.name, email: profile._json.email,provider: profile.provider }]);
          }

          client.close();

          done(null, profile);
        } catch (error) {
          console.error('Error processing Google OAuth callback:', error);
          done(error);
        }
      }
    )
  );
};
