const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
    // Check for token in cookies first, then in Authorization header
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.substring(7); // Remove 'Bearer ' prefix
    }

    if (!token) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

const protect = (req, res, next) => {
    try {
        // Check for token in cookies first, then in Authorization header
        let token = req.cookies.token;
        
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.substring(7); // Remove 'Bearer ' prefix
        }
        
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        return res.status(401).json({ message: "Token invalid or expired" });
    }
}

module.exports = {
    authMiddleware,
    adminOnly,
    protect
}
