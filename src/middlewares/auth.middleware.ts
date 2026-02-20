import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role?: string;
    };
}

/**
 * JWT Authentication Middleware
 * Verifies the access token from the Authorization header.
 * Usage: router.get("/protected", authenticate, handler);
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access token is required" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET as string
        ) as { id: string; role?: string };

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token has expired" });
        }
        return res.status(401).json({ error: "Invalid token" });
    }
};

/**
 * Role-based Authorization Middleware
 * Usage: router.get("/admin", authenticate, authorize("ADMIN"), handler);
 */
export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Insufficient permissions" });
        }
        next();
    };
};
