import express from 'express';
import { registerUser, loginUser, updateUserProfile, googleAuthSuccess } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getUsers } from '../controllers/authController.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').put(protect, updateUserProfile);
router.route('/').get(protect, admin, getUsers);

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
}));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  googleAuthSuccess
);
export default router;