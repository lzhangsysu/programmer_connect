const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        await jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
            if (error) {
                res.status(401).json({ msg: 'Token not valud'});
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } catch (err) {
        res.status(401).json({ msg: 'Server Error' });
    }
};