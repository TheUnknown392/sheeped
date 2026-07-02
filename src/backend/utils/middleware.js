import {jwtVerify} from './jwt.js'


export function requireAdmin(req, res, next) {
    if (req.user.rl !== "admin") {
        return res.status(403).json({
            message: "Admin access required."
        });
    }

    next();
}


export function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided."
        });
    }

    const decoded = jwtVerify(authHeader);

    if (!decoded) {
        return res.status(401).json({
            message: "Invalid token."
        });
    }

    req.user = decoded;
    next();
}
