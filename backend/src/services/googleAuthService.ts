// import { OAuth2Client } from 'google-auth-library';
// import { User } from '../models/User.js';

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export const verifyGoogleToken = async (idToken: string) => {
//   try {
//     const ticket = await client.verifyIdToken({
//       idToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     return ticket.getPayload();
//   } catch (error) {
//     throw new Error('Invalid Google token');
//   }
// };

// export const findOrCreateGoogleUser = async (profile: any) => {
//   const { email, name, picture, sub: googleId } = profile;

//   let user = await User.findOne({ email });

//   if (!user) {
//     user = await User.create({
//       name,
//       email,
//       isAdmin: false,
//     });
//   }
//   return user;
// };