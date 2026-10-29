import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { authRateLimiter, otpRateLimiter } from '../middleware/rateLimit';
import {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../validators';

const router = Router();

router.post('/send-otp', otpRateLimiter, validate(sendOtpSchema), authController.sendOtp);
router.post('/verify-email', authRateLimiter, validate(verifyOtpSchema), authController.verifyOtp);
router.post('/register', authRateLimiter, validate(registerSchema), authController.register);
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);
router.post('/forgot-password', authRateLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/verify-reset-code', authRateLimiter, validate(verifyResetCodeSchema), authController.verifyResetCode);
router.post('/reset-password', authRateLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.post('/change-password', authenticate, authRateLimiter, validate(changePasswordSchema), authController.changePassword);

export default router;
