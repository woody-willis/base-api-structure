/** @module routes/v1/hello-world */

// Register router

const express = require('express');
const router = express.Router();

/** Route for getting book information */
router.get('/hello-world', async (req, res) => {
    res.send('Hello, World!');
});

module.exports = router;

// Functions
