import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AuthRequest from '../interfaces/authrequest';
import authRouter from './authRoutes.routes';
import { UserModel } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || '6f2e6c6eefa04cb098f1c9112dev2025NixFuts';

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

//example of protected route
// authRouter.get('/me', auth, async (req, res) => {
//   try {
//     const user = await UserModel.findById((req as any).user.userId).select('-password');
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });