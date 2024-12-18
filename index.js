const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const passport = require('passport');
require('./passport');

const cors = require('cors');
const allowedOrigins = [
    "http://localhost:8080",
    "http://localhost:1234",
    "https://deepa-myflixapp.netlify.app",
    "https://deeps4.github.io"
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                // If a specific origin isn’t found on the list of allowed origins
                let message =
                    "The CORS policy for this application doesn’t allow access from origin " +
                    origin;
                return callback(new Error(message), false);
            }
            return callback(null, true);
        },
    })
);

const { check, validationResult } = require('express-validator');

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });



app.use(morgan('common'));
app.use('/', express.static('public'));
app.use(bodyParser.json());

let auth = require('./auth')(app);

/**
 * @name GET /movies
 * @summary Retrieve all movies
 * @description
 * Returns a list of all movies.
 * <br>
 * This endpoint requires "Bearer Token Authentication" using a JWT token.
 * <br>
 * Include the token in the Authorization header as follows: Authorization: Bearer <JWT Token>
 * @returns {Array<Object>} 201 - List of movies
 * @returns {Error} 500 - Internal Server Error
 * @example response - 201 - Success Response
 * [
 *   {
 *     "_id": "60f5a4f8c45e4c1b8c6f1234",
 *     "Title": "Inception",
 *     "Description": "A thief who steals corporate secrets...",
 *     "Genre": { "Name": "Science Fiction", "Description": "..." },
 *     "Director": { "Name": "Christopher Nolan", "Bio": "..." },
 *     "Actors": ["Leonardo DiCaprio"],
 *     "ImagePath": "https://example.com/images/inception.jpg",
 *     "Featured": true
 *   }
 * ]
 * 
 * @example response - 500 - Error Response
 * "Error: Something went wrong."
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

/**
 * @name GET /movies/{movieId}
 * @summary Retrieve a movie by ID
 * @description
 * Returns details of a specific movie using its ID.
 
 * <br>
 * This endpoint requires "Bearer Token Authentication" using a JWT token.
 * <br>
 * Include the token in the Authorization header as follows: Authorization: Bearer <JWT Token>
 * 
 * @example response - 200 - Success Response
 *   {
 *     "_id": "60f5a4f8c45e4c1b8c6f1234",
 *     "Title": "Inception",
 *     "Description": "A thief who steals corporate secrets...",
 *     "Genre": { "Name": "Science Fiction", "Description": "..." },
 *     "Director": { "Name": "Christopher Nolan", "Bio": "..." },
 *     "Actors": ["Leonardo DiCaprio"],
 *     "ImagePath": "https://example.com/images/inception.jpg",
 *     "Featured": true
 *   }
 * 
 * @example response - 500 - Error Response
 * "Error: Something went wrong."
 */
app.get('/movies/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findById(req.params.movieId)
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
})

/**
 * @name GET /movies/titles/{Title}
 * @summary Retrieve a movie by title
 * @description 
 * Returns a movie's details based on its title.
 
 * <br>
 * This endpoint requires "Bearer Token Authentication" using a JWT token.
 * <br>
 * Include the token in the Authorization header as follows: Authorization: Bearer <JWT Token>
 * 
 * @example response - 200 - Success Response
 *   {
 *     "_id": "60f5a4f8c45e4c1b8c6f1234",
 *     "Title": "Inception",
 *     "Description": "A thief who steals corporate secrets...",
 *     "Genre": { "Name": "Science Fiction", "Description": "..." },
 *     "Director": { "Name": "Christopher Nolan", "Bio": "..." },
 *     "Actors": ["Leonardo DiCaprio"],
 *     "ImagePath": "https://example.com/images/inception.jpg",
 *     "Featured": true
 *   }
 * 
 * @example response - 500 - Error Response
 * "Error: Something went wrong."
 */
app.get('/movies/titles/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

/**
 * @name GET /users
 * @summary Retrieve all users
 * @description 
 * Returns a list of all registered users.
 
 * <br>
 * This endpoint requires "Bearer Token Authentication" using a JWT token.
 * <br>
 * Include the token in the Authorization header as follows: Authorization: Bearer <JWT Token>
 * @example response - 200 - Success Response
 * [
 *   {
 *     "_id": "60f5b1c8c45e4c1b8c6f5678",
 *     "Username": "john_doe",
 *     "Email": "john.doe@example.com",
 *     "Birthday": "1990-05-15T00:00:00.000Z",
 *     "FavouriteMovies": ["60f5a4f8c45e4c1b8c6f1234"]
 *   }
 * ]
 * 
 * @example response - 500 - Error Response
 * "Error: Something went wrong."
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });

})

/**
 * @name GET /movies/genres/{genreName}
 * @summary Retrieve movies by genre
 * @description 
 * Returns movies based on the genre name.
 
 * <br>
 * This endpoint requires "Bearer Token Authentication" using a JWT token.
 * <br>
 * Include the token in the Authorization header as follows: Authorization: Bearer <JWT Token>
 * 
 * @example response - 200 - Success Response
 *   {
 *     "_id": "60f5a4f8c45e4c1b8c6f1234",
 *     "Title": "Inception",
 *     "Description": "A thief who steals corporate secrets...",
 *     "Genre": { "Name": "Science Fiction", "Description": "..." },
 *     "Director": { "Name": "Christopher Nolan", "Bio": "..." },
 *     "Actors": ["Leonardo DiCaprio"],
 *     "ImagePath": "https://example.com/images/inception.jpg",
 *     "Featured": true
 *   }
 * 
 * @example response - 500 - Error Response
 * "Error: Something went wrong."
 */
app.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genreName })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        })


});

/**
 * @name GET /movies/directors/{directorName}
 * @summary Retrieve director details
 * @description 
 * Returns information about a movie's director.
 
 * <br>
 * This endpoint requires "Bearer Token Authentication" using a JWT token.
 * <br>
 * Include the token in the Authorization header as follows: Authorization: Bearer <JWT Token>
 * 
 * @example response - 200 - Success Response
 *   {
 *     "_id": "60f5a4f8c45e4c1b8c6f1234",
 *     "Title": "Inception",
 *     "Description": "A thief who steals corporate secrets...",
 *     "Genre": { "Name": "Science Fiction", "Description": "..." },
 *     "Director": { "Name": "Christopher Nolan", "Bio": "..." },
 *     "Actors": ["Leonardo DiCaprio"],
 *     "ImagePath": "https://example.com/images/inception.jpg",
 *     "Featured": true
 *   }
 * 
 * @example response - 500 - Error Response
 * "Error: Something went wrong."
*/
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.directorName })
        .then((movie) => {
            res.json(movie.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        })

});


/**
 * @name POST /users
 * @summary Register a new user
 * @description Creates a new user account.
 *
 * @example request body
 *   {
 *     "Username": "john_doe",
 *     "Password": "Test@123",
 *     "Email": "john.doe@example.com",
 *     "Birthday": "1990-05-15T00:00:00.000Z",
 *   }
 * 
 * 
 * @example response - 201 - Success Response
 * "User created: {username}"
 * 
 * @example response - 422 - Error Response
 * {
 *  errors: [
 *   {Username: 'Username is required'}, 
 *   {Username: 'Username contains non alphanumeric characters - not allowed.'},
 *   {Password: 'Password is required'},
 *   {Email: 'Email does not appear to be valid'}
 *  ]
 * }
 * 
 * @example response - 400 - Error Response
 * {username} already exists
 * 
 * @example response - 500 - Error Response
 * "Error: Something went wrong."
 */
app.post('/users', [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOne({ 'Username': req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + " already exists.")
            } else {
                Users.create({
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                })
                    .then((user) => {
                        res.status(201).json(`User created: ${user.Username}`);
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send("Error: " + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });

});

/**
 * @name PUT /users/{Username}
 * @summary Update user information
 * @description 
 * Updates a user's username, email, or birthday.
 
 * <br>
 * This endpoint requires "Bearer Token Authentication" using a JWT token.
 * <br>
 * Include the token in the Authorization header as follows: Authorization: Bearer <JWT Token>
 * 
 * @example request body
 *   {
 *     "Username": "john_doe",
 *     "Email": "john.doe@example.com",
 *     "Birthday": "1990-05-15T00:00:00.000Z",
 *   }
 * 
 * @example response - 200 - Success Response
 *   {
 *     "_id": "60f5b1c8c45e4c1b8c6f5678",
 *     "Username": "john_doe",
 *     "Email": "john.doe@example.com",
 *     "Birthday": "1990-05-15T00:00:00.000Z",
 *     "FavouriteMovies": ["60f5a4f8c45e4c1b8c6f1234"]
 *   }
 * 
 * @example response - 500 - Error Response
 * "Error: Something went wrong."
 */
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ 'Username': req.params.Username },
        {
            $set: {
                Username: req.body.Username,
                Email: req.body.Email,
                Birthday: req.body.Birthday,
            }
        },
        { new: true })
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});


/**
 * @name POST /users/{Username}/movies/{MovieID}
 * @summary Add a movie to favorites
 * @description 
 * Adds a movie to the user's favorite movies list.
 
 * <br>
 * This endpoint requires "Bearer Token Authentication" using a JWT token.
 * <br>
 * Include the token in the Authorization header as follows: Authorization: Bearer <JWT Token>
 * 
 * @example response - 200 - Success Response
 *   {
 *     "_id": "60f5b1c8c45e4c1b8c6f5678",
 *     "Username": "john_doe",
 *     "Email": "john.doe@example.com",
 *     "Birthday": "1990-05-15T00:00:00.000Z",
 *     "FavouriteMovies": ["60f5a4f8c45e4c1b8c6f1234"]
 *   }
 * 
 * @example response - 500 - Error Response
 * "Error: Something went wrong."
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ 'Username': req.params.Username },
        { $push: { "FavouriteMovies": req.params.MovieID } },
        { new: true })

        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })

});


/**
 * @name DELETE /users/{Username}/movies/{MovieID}
 * @summary Remove a movie from favorites
 * @description 
 * Removes a movie from the user's favorite list.
 
 * <br>
 * This endpoint requires "Bearer Token Authentication" using a JWT token.
 * <br>
 * Include the token in the Authorization header as follows: Authorization: Bearer <JWT Token>
 * 
 * @example response - 200 - Success Response
 *   {
 *     "_id": "60f5b1c8c45e4c1b8c6f5678",
 *     "Username": "john_doe",
 *     "Email": "john.doe@example.com",
 *     "Birthday": "1990-05-15T00:00:00.000Z",
 *     "FavouriteMovies": ["60f5a4f8c45e4c1b8c6f1234"]
 *   }
 * 
 * @example response - 500 - Error Response
 * "Error: Something went wrong."
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ 'Username': req.params.Username },
        { $pull: { "FavouriteMovies": req.params.MovieID } },
        { new: true })

        .then((user) => {
            res.json(user);

        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })

});

/**
 * @name DELETE /users/{Username}
 * @summary Delete a user
 * @description 
 * Deletes a user account.
 * <br>
 * This endpoint requires "Bearer Token Authentication" using a JWT token.
 * <br>
 * Include the token in the Authorization header as follows: Authorization: Bearer <JWT Token>
 * 
 * 
 * @example response - 200 - Success Response
 * "{username} was deleted."
 * 
 * @example response - 400 - Error Response
 * "{username} was not found."
 * 
 * @example response - 500 - Error Response
 * "Error: Something went wrong."
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {

    Users.deleteOne({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found.');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * @name POST /users/{Username}/change-password
 * @summary Change user password
 * @description 
 * Allows the user to update their password.
 
 * <br>
 * This endpoint requires "Bearer Token Authentication" using a JWT token.
 * <br>
 * Include the token in the Authorization header as follows: Authorization: Bearer <JWT Token>
 * 
 * @example Request body
 *   {
 *     "OldPassword": "OldPass123",
 *     "Password": "Test@12345"
 *   }
 * 
 * @example response - 200 - Success Response
 * {message: "Password updated successfully"}
 * 
 * @example response - 401 - Error Response
 * "Given old password is not correct."
 * 
 * @example response - 500 - Error Response
 * "Error: Something went wrong."
 */
app.post('/users/:Username/change-password', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username }).select("+Password")
        .then((user) => {
            if (user.validatePassword(req.body.OldPassword)) {
                const hashedPassword = Users.hashPassword(req.body.Password);
                Users.findOneAndUpdate({ 'Username': req.params.Username },
                    {
                        $set: {
                            Password: hashedPassword,
                        }
                    })
                    .then(() => {
                        res.json({
                            message: "Password updated successfully"
                        })
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(500).send('Error: ' + err);
                    })
            } else {
                res.status(401).json({
                    errorMessage: 'Given old password is not correct.'
                });
            }
        })
});

const port = process.env.PORT || 8080;

app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});


