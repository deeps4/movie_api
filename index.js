const express = require('express');
const morgan = require('morgan');
const app = express();



let topMovies = [
    { movieName: 'Hera Pheri' },
    { movieName: 'Bhool Bhulaiyaa' }
];

app.use(morgan('common'));
app.use('/', express.static('public'));



app.get('/', (req, res) => {
    res.send('Welcome to my movie club!');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});

