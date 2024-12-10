const jwtSecret = 'film_api@1234';

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport');

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

/**
 * @name POST /login
 * @summary User login endpoint.
 * @description Authenticates a user and returns a JWT token and user data upon success.
 * 
 * @example Request body
 * {
 *  Username: "JohnDoe",
 *  Password: "Test@123"
 * }
 *
 * @example response - 200 - Success Response
 * {
 *   "user": {
 *     "_id": "60f5b1c8c45e4c1b8c6f5678",
 *     "Username": "john_doe",
 *     "Email": "john.doe@example.com",
 *     "Birthday": "1990-05-15T00:00:00.000Z",
 *     "FavouriteMovies": ["60f5a4f8c45e4c1b8c6f1234"]
 *   },
 *   "token": "JWT_TOKEN_HERE"
 * }
 *
 * @example response - 400 - Error Response
 * {
 *   "message": "Username or password is incorrect."
 * }
 */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right'
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                const { Password, ...userWithoutPassword } = user.toJSON();
                return res.json({ user: userWithoutPassword, token });
            });
        })(req, res);
    });
}
