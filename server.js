require('dotenv').config();

const express = require('express');
const { listenFunc } = require('./db');

const app = express();

app.use(express.static('.'));

app.get('/get-word', async (req, res) => {
    try {
        const rows = await listenFunc();
        if (!rows || rows.length === 0) {
            return res.status(500).send('No word found');
        }
        if (!rows[0] || !rows[0].palavra) {
            return res.status(500).send('Invalid row format from database');
        }
        return res.json({ word: rows[0].palavra });
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
