const http = require('http');
const moment = require('moment');
const about = require('./member.js');
const users = require('./users.js');

const server = http.createServer((req, res) => {
    res.statusCode= 200;
    res.setHeader('Content-type', 'text/html');

    if(req.url === "/about") {
        res.write(JSON.stringify({
            'Status': 'success',
            'Message': "response success",
            'Description': "Group Exercise #03",
            'Date': moment().format(),
            'Data': about.data
        }));
    }
    else if(req.url === "/users") {
        res.write(JSON.stringify({
            'user': users
        }));
    }
    else {
        const fs = require('fs');
        res.write(fs.readFileSync('./index.html'));
    }
    
    res.end();
});

const hostname = 'localhost';
const port = 3000;
server.listen(port, hostname, () => {
    console.log(`Server running at https://${hostname}:${port}/`);
});

