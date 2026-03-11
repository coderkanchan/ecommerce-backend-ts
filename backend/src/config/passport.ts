import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User.js';

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: process.env.NODE_ENV === 'production'
          ? 'https://ecommerce-backend-ts-1f17.onrender.com/api/users/google/callback'
          : '/api/users/google/callback',
        proxy: true
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails?.[0].value });

          const imageUrl = profile.photos?.[0]?.value;

          if (user) {
            if (!user.profileImage && imageUrl) {
              user.profileImage = imageUrl;
              await user.save();
            }
            return done(null, user);
          }

          user = await User.create({
            name: profile.displayName,
            email: profile.emails?.[0].value,
            profileImage: imageUrl, 
            isAdmin: false,
          });

          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
};
