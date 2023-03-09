const express = require('express');
let users = require('./users');


const app = express();
const port = 3000;
app.use(express.urlencoded({extended:true}));
app.use(express.json());


// GET Default
app.get('/', (req, res) => {
    res.send(`
        <h1>Latihan Backend</h1>
    `);
});

// GET users
app.get('/users', (req, res) => {
    res.send(users);
});

// GET users name
app.get('/users/:name', (req, res) => {
    const data = users.filter(r => r.name.toLowerCase() === req.params.name.toLowerCase());

    if(data.length === 0) {
        res.send(JSON.stringify({
            message: "Data user tidak ditemukan."
        }));
    }
    else {
        res.send(JSON.stringify({
            id: data[0].id,
            name: data[0].name,
        }));
    }
});


// Error handling
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send(JSON.stringify({
        status: 'error',
        message: "terjadi kesalahan pada server."
    }));
});

// Routing 404 handling
app.use((req, res, next) => {
    res.status(404).send(JSON.stringify({
        status: 'error',
        message: "resource tidak ditemukan.",
    }));
});



app.listen(port, () => console.log(`Server is running at http://localhost:${port}.`));
