const express = require('express');
const path = require('path');
const multer = require('multer');
const db = require('./db');
const cors = require("cors");
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors({ origin: '*', credentials: true }));



const session = require('express-session');

// Enable sessions
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to `true` if using HTTPS
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(__dirname + '/images'));


//API to fetch hospitals
app.get('/api/hospitals/:placeid', async (req, res) => {
    const locId = req.params.placeid;
    try {
        const [hospitals] = await db.query('SELECT name FROM hospitals WHERE loc_id = ?', [locId]);
        res.json(hospitals);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/api/specialities/:placeid', async (req, res) => {
    const locId = req.params.placeid;
    try {
        const [specialities] = await db.query(`
            SELECT DISTINCT s.*
            FROM specialities s
            JOIN doctors d ON d.speciality_id = s.id
            JOIN hospitals h ON h.id = d.hospital_id
            WHERE h.loc_id = ?
        `, [locId]);
        res.json(specialities);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/api/doctors/:placeid', async (req, res) => {
    const locId = req.params.placeid;
    try {
        const [doctors] = await db.query('SELECT * FROM doctors WHERE hospital_id in (select id from hospitals where loc_id = ?)', [locId]);
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/api/slots/:doctorid', async (req, res) => {
    const doctorid = req.params.doctorid;
    try {
        const [slots] = await db.query('SELECT * FROM slots WHERE doctor_id = ?', [doctorid]);
        res.json(slots);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/api/speciality/:id', async (req, res) => {
    const speciality_id = req.params.id;
    try {
        const [speciality] = await db.query('SELECT name FROM specialities WHERE id = ?', [speciality_id]);
        res.json(speciality);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/api/hospital/:id', async (req, res) => {
    const hospital_id = req.params.id;
    try {
        const [hospital] = await db.query('SELECT name FROM hospitals WHERE id = ?', [hospital_id]);
        res.json(hospital);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
//code for sighning up
// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body; // Changed 'user' to 'username'
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Server error');
            } else {
                res.json({ success: true, message: 'User registered successfully' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT password_hash FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        const hashedPassword = results[0].password_hash;
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (isMatch) {
            req.session.user = { username }; // Store user in session
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid username or password' });
        }
    });
});

// Endpoint to check if user is signed in
app.get('/check-auth', (req, res) => {
    if (req.session.user) {
        res.json({ isSigned: true, username: req.session.user.username });
    } else {
        res.json({ isSigned: false });
    }
});



const PORT = 3000;
const HOST = '0.0.0.0'; // Allows access from any device in the network

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
