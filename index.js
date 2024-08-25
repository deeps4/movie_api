const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();



let movies = [
    {
        title: 'Titanic',
        description: 'A love story that unfolds between a young man and woman on the ill-fated RMS Titanic.',
        genre: {
            name: 'Romance',
            description: 'A genre that emphasizes emotional, dramatic, and romantic content.'
        },
        director: {
            name: 'James Cameron',
            bio: 'James Cameron is a Canadian filmmaker and environmentalist known for his innovative work in science fiction and epic films.',
            birth: '1954-08-16'
        },
        imageUrl: 'https://example.com/titanic.jpg',
        featured: true
    },
    {
        title: 'The Godfather',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        genre: {
            name: 'Crime/Drama',
            description: 'A genre that delves into the world of crime, focusing on characters and their moral dilemmas.'
        },
        director: {
            name: 'Francis Ford Coppola',
            bio: 'Francis Ford Coppola is an American film director, producer, and screenwriter, known for his landmark films in American cinema.',
            birth: '1939-04-07'
        },
        imageUrl: 'https://example.com/godfather.jpg',
        featured: true
    },
    {
        title: 'The Dark Knight',
        description: 'Batman raises the stakes in his war on crime. With the help of allies, he sets out to dismantle the remaining criminal organizations that plague the streets.',
        genre: {
            name: 'Action/Thriller',
            description: 'A genre that combines intense action sequences with suspenseful plotlines.'
        },
        director: {
            name: 'Christopher Nolan',
            bio: 'Christopher Nolan is a British-American filmmaker known for his cerebral, often non-linear, storytelling.',
            birth: '1970-07-30'
        },
        imageUrl: 'https://example.com/darkknight.jpg',
        featured: true
    },
    {
        title: 'Pulp Fiction',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        genre: {
            name: 'Crime/Drama',
            description: 'A genre that delves into the world of crime, often with non-linear narratives and complex characters.'
        },
        director: {
            name: 'Quentin Tarantino',
            bio: 'Quentin Tarantino is an American filmmaker known for his stylistic dialogue, non-linear storylines, and violent content.',
            birth: '1963-03-27'
        },
        imageUrl: 'https://example.com/pulpfiction.jpg',
        featured: true
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.',
        genre: {
            name: 'Fantasy/Adventure',
            description: 'A genre that involves magical elements and epic journeys set in imaginary worlds.'
        },
        director: {
            name: 'Peter Jackson',
            bio: 'Peter Jackson is a New Zealand filmmaker known for his epic adaptations of J.R.R. Tolkien\'s works.',
            birth: '1961-10-31'
        },
        imageUrl: 'https://example.com/lotr-returnoftheking.jpg',
        featured: true
    },
    {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
        genre: {
            name: 'Sci-Fi/Thriller',
            description: 'A genre that explores futuristic concepts, often involving science and technology, with elements of suspense.'
        },
        director: {
            name: 'Christopher Nolan',
            bio: 'Christopher Nolan is a British-American filmmaker known for his cerebral, often non-linear, storytelling.',
            birth: '1970-07-30'
        },
        imageUrl: 'https://example.com/inception.jpg',
        featured: true
    },
    {
        title: 'Forrest Gump',
        description: 'The story of Forrest Gump, a man with a low IQ, who unwittingly influences several historical events in the 20th century United States.',
        genre: {
            name: 'Drama/Romance',
            description: 'A genre that combines emotional storytelling with elements of romance.'
        },
        director: {
            name: 'Robert Zemeckis',
            bio: 'Robert Zemeckis is an American director and producer known for his innovative visual effects and compelling storytelling.',
            birth: '1952-05-14'
        },
        imageUrl: 'https://example.com/forrestgump.jpg',
        featured: true
    },
    {
        title: 'The Matrix',
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        genre: {
            name: 'Sci-Fi/Action',
            description: 'A genre that blends futuristic science fiction concepts with intense action sequences.'
        },
        director: {
            name: 'The Wachowskis',
            bio: 'Lana and Lilly Wachowski are American filmmakers known for their work in science fiction and action genres.',
            birth: '1965-06-21'
        },
        imageUrl: 'https://example.com/matrix.jpg',
        featured: true
    },
    {
        title: 'Schindler\'s List',
        description: 'In German-occupied Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
        genre: {
            name: 'Historical Drama',
            description: 'A genre that dramatizes historical events and figures with emotional depth and realism.'
        },
        director: {
            name: 'Steven Spielberg',
            bio: 'Steven Spielberg is an American filmmaker and one of the most commercially successful directors in the history of cinema.',
            birth: '1946-12-18'
        },
        imageUrl: 'https://example.com/schindlerslist.jpg',
        featured: true
    },
    {
        title: 'Avatar',
        description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
        genre: {
            name: 'Sci-Fi/Adventure',
            description: 'A genre that blends science fiction concepts with epic journeys and explorations of alien worlds.'
        },
        director: {
            name: 'James Cameron',
            bio: 'James Cameron is a Canadian filmmaker known for his work in epic science fiction and action genres.',
            birth: '1954-08-16'
        },
        imageUrl: 'https://example.com/avatar.jpg',
        featured: true
    }
];

let users = [
    {
        id: 1,
        name: 'Jhon',
        favouriteMovie: ['Titanic']
    },
    {
        id: 2,
        name: 'Leo',
        favouriteMovie: ['']
    }

]

app.use(morgan('common'));
app.use('/', express.static('public'));
app.use(bodyParser.json());

app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

app.get('/movies/:title', (req, res) => {
    const title = req.params.title;
    // const { title } = req.params;
    //movies.find is a method which applies on an array. 
    const movie = movies.find(movie => movie.title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('No such movie found.')
    }
});


app.get('/movies/genre/:genreName', (req, res) => {
    const genreName = req.params.genreName;
    const genre = movies.find(movie => movie.genre.name === genreName).genre

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('No such genre found.')
    }

});

//Return data about a director (bio, birth year, death year) by name

app.get('/movies/director/:directorName', (req, res) => {
    const directorName = req.params.directorName;
    const director = movies.find(movie => movie.director.name === directorName).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('No such director found.')
    }
});

//Allow new users to register

app.post('/users', (req, res) => {
    console.log(req.body, '---');
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need name.');
    }
});

//Allow users to update their user info (username);

app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;
    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name
        res.status(200).json(user);
    }
});

// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added); 

app.post('/users/:id/:movieTitle', (req, res) => {
    const id = req.params.id;
    const movieTitle = req.params.movieTitle;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favouriteMovie.push(movieTitle);
        res.status(200).send('Movie name has been added.');
    } else {
        res.status(400).send('No such user.')
    }
});

//Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later);

app.delete('/users/:id/:movieTitle', (req, res) => {
    const id = req.params.id;
    const movieTitle = req.params.movieTitle;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favouriteMovie = user.favouriteMovie.filter(movie => movie !== movieTitle);
        res.status(200).send('Movie name has been removed.');
    } else {
        res.status(400).send('No such user.');
    };

});

//Allow existing users to deregister (showing only a text that a user email has been removed)

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id !== id);
        res.status(200).send('User email has been removed.')
    } else {
        res.status(400).send('No such user.')
    }
})

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});

