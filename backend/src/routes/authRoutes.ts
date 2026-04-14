import express from 'express';
import { registerUser, loginUser, updateUserProfile, googleAuthSuccess, getUserProfile } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getUsers } from '../controllers/authController.js';
import passport from 'passport';
import { makeUserSeller } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/').get(protect, admin, getUsers);

router.get('/google', (req, res, next) => {
  const redirectPath = (req.query.redirect as string) || '/';
  
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: redirectPath 
  })(req, res, next);
});

router.put('/become-seller', protect, makeUserSeller);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  googleAuthSuccess
);
export default router;
