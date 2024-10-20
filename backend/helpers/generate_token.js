const jwt = require('jsonwebtoken');

exports.create_token = (_id) => {
    try {
        return jwt.sign({ _id }, process.env.JWT_KEY, { expiresIn: '2d' });
    } catch (error) {
        return error;
    }
};