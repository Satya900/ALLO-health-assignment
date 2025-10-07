const authMiddleware = (req, res, next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            error: "Unauthorized"
        })
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

module.exports = {
    authMiddleware,
    adminOnly
}
