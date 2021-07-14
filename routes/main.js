const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const characterController = require('../controllers/characters');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

//Main Routes - simplified for now
router.get('/', homeController.getIndex);
router.get('/account', ensureAuth, characterController.getAccount);
// router.get('/demo', characterController.getDemo); // WIP
// router.get('/favfeed', ensureAuth, characterController.getFeed); // favfeed temp removed
router.get('/dashboard', ensureAuth, characterController.getDashboard);
router.get('/newchar', ensureAuth, characterController.getNewChar);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

module.exports = router;
