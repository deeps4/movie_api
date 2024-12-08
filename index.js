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
    "https://deeps4.github.io/myFlix-Angular-client"
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

//Return data about a director (bio, birth year, death year) by name

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

//Allow new users to register

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

//Allow users to update their user info (username);

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

// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added); 

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

//Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed);

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

//Allow existing users to deregister (showing only a text that a user email has been removed)

app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {

    Users.deleteOne({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// To change password for a user.
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


