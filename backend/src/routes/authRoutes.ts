import express from 'express';
import passport from 'passport';
import {
  registerUser,
  loginUser,
  updateUserProfile,
  googleAuthSuccess,
  getUserProfile,
  getUsers,
  makeUserSeller,
  updateStoreDetails
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/google', (req, res, next) => {
  const redirectPath = (req.query.redirect as string) || '/';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: redirectPath
  })(req, res, next);
});

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  googleAuthSuccess
);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put('/become-seller', protect, makeUserSeller);
router.put('/profile/store', protect, updateStoreDetails);

router.route('/').get(protect, admin, getUsers);

export default router;