const jwt = require('jsonwebtoken');
const { Forbidden } = require('../../errors');

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) throw new Forbidden('You are sending an invalid token');

    const token = authHeader.split(' ')[1]

    if (!token) throw new Forbidden('You are sending an invalid token')

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) throw new Forbidden('Bad token')

        const userData = {
            email: data.UserInfo.email,
            role: data.UserInfo.role
        }

        req.user = userData;

        next()
    })
}

module.exports = verifyJWT;