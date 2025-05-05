import * as express from "express";
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from "../models/user.model";

const authRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || '6f2e6c6eefa04cb098f1c9112dev2025NixFuts';

//CREATE USER - POST
authRouter.post('/register', [
    body('username').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
],  //fix req/res typing issue
    async (req: any, res: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            let user = await UserModel.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }
            //USE BCRYPT TO HASH PASSWORD
            // The second parameter is the salt rounds, which determines how many times the password will be hashed
            const hashedPassword = await bcrypt.hash(password, 10);

            user = new UserModel({
                username,
                email,
                password: hashedPassword,
            });

            await user.save();

            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    });

//LOGIN USER - POST
authRouter.post('/login', [
    body('email').isEmail(),
    body('password').exists(),
],  //fix req/res typing issue
    async (req: any, res: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        //try to find user by email 
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            //if found - match password with bcrypt
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const payload = { userId: user.id };
            //create JWT token with user id and secret key and set expiration time
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

            res.json({ token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    });

export default authRouter;
