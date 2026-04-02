const express = require('express');
const { signup } = require('../controllers/auth.controller');

const router = express.Router();

// This maps the URL to the logic
router.post("/signup", signup);

module.exports = router;