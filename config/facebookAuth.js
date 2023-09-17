const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const connectToMongoDB = require('../models/usersdb'); // Adjust the path as needed

module.exports = (passport) => {
  passport.use(
    new FacebookStrategy(
        {
        clientID: '853120292897075',
        clientSecret: '13eec7caf3df41b347bfa71a906e883d',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const client = await connectToMongoDB();
          const db = client.db();
          const usersCollection = db.collection('users');

          const existingUser = await usersCollection.findOne({ facebookId: profile.id });

          if (!existingUser) {
            await usersCollection.insertOne({
              facebookId: profile.id,
              username: profile._json.name,
              provider: profile.provider,
              // Add other fields as needed
            });
          }

          client.close();

          done(null, profile);
        } catch (error) {
          console.error('Error processing Facebook OAuth callback:', error);
          done(error);
        }
      }
    )
  );
};
