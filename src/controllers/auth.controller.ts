import { Request, Response } from "express";
import { registerUser, loginUser } from "../auth/auth.service";
import { registerSchema, loginSchema } from "../auth/auth.validation";

export const register = async (req: Request, res: Response) => {
    registerSchema.parse(req.body);

    const user = await registerUser(req.body);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
};

export const login = async (req: Request, res: Response) => {
    loginSchema.parse(req.body);

    const result = await loginUser(
        req.body.email,
        req.body.password
    );

    res.json(result);
};
