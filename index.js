const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path')
const multer = require('multer');
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
        <h1>Method Server GET,POST,PUT,DELETE</h1>
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

// POST
// Konfigurasi penyimpanan file menggunakan Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'public/');
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  // Konfigurasi upload file menggunakan Multer
  const upload = multer({ storage: storage });
  
  // Handler untuk endpoint /upload
  app.post('/upload', upload.single('image'), function(req, res, next) {
    // Jika file berhasil diunggah, kirimkan respons
    res.json({ message: 'File uploaded successfully.' });
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