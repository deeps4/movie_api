const http = require('http');
const url = require('url');
const fs = require('fs');

const server = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello Node!\n');

    const addr = request.url;
    const q = new URL(addr, 'http://localhost:8080');
    let filePath = '';

    if (q.pathname.includes('documentation')) {

        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }
    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }
    });

    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });
};

http.createServer(server).listen(8080);
console.log('My first Node test server is running on Port 8080.');

