const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token missing or invalid' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // Attach decoded token data to the request object
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authorization failed' });
    }
};

module.exports = auth;
