const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
let users = require('./users');

const app = express();
const port = 3000;
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// CORS Handling
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));



// Log using Morgan
app.use(morgan('combined'), (req, res, next) => {
    next();
});

// GET Default
app.get('/', (req, res) => {
    res.send(`
        <h1>Group 1</h1>
        <p>Chrysto Pollatu</p>
        <p>Abraham Laurens William Rompis</p>
        <p>Girard Rampengan</p>
        <p>Geovalga Fransiscus Lim</p>
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

// PUT users name
app.put('/users/:name', (req, res) => {
    const {name} = req.body;
    
    if(users.filter(r => r.name.toLowerCase() === req.params.name.toLowerCase()).length === 0) {
        res.status(400).send(JSON.stringify({
            message: "Masukkan data yang akan diubah."
        }));
    }
    else if(name.length < 0 || !name.match(/[0-z]/i)) {
        res.status(400).send(JSON.stringify({
            message: "Masukkan data untuk mengubah data yang sudah ada."
        }));
    }
    else {
        users.forEach(r => {
            if(r.name.toLowerCase() === req.params.name.toLowerCase()) {
                r.name = name;
            }
        });

        res.send(users);
    }
});

// DELETE users name
app.delete('/users/:name', (req, res) => {
    if(users.filter(r => r.name.toLowerCase() === req.params.name.toLowerCase()).length === 0) {
        res.send(JSON.stringify({
            message: "Data user tidak ditemukan."
        }));
    }
    else {
        users = users.filter(r => r.name.toLowerCase() !== req.params.name.toLowerCase());
        res.send(users);
    }
});

// POST users
app.post('/users', (req, res) => {
    const {name} = req.body;

    if(name.length > 0 && name.match(/[0-z]/i)) {
        if(users.filter(r => r.name.toLowerCase() === name.toLowerCase()).length === 0) {
            if(users.length === 0)  {
                id = 1;
            }
            else if (users.length === 1) {
                id = users[0].id + 1;
            }
            else {
                let com = true;

                for(let r=0; r<users.length-1; r++) {
                    if(users[r].id+1 !== users[r+1].id) {
                        id = users[r].id + 1;
                        com = false;
                        break;
                    }
                }
                
                if(com) {
                    id = users.length + 1;
                }
            }

            let obj = {
                id, name
            };
            users.splice(id-1, 0, obj);
        }

        res.send(users);
    }
    else {
        res.status(400).send(JSON.stringify({
            message: "Masukkan data yang akan diubah."
        }));
    }
});

// penanganan error
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

