const express = require('express');
const router = express.Router();
const cors = require('cors')
const { createUser, userSignIn, profile, signOut } = require('../controllers/user');
const { isAuth } = require('../middleware/auth');
const { validateUserSignIn, userValidation } = require('../middleware/validation/user');
const { createEntry, getEntriesByUserId, exitEntry, entryCount } = require('../controllers/entry');

router.use(cors());

router.post('/create-user', validateUserSignIn, userValidation, createUser);
router.post('/sign-in', userSignIn, validateUserSignIn, userValidation);
router.get('/sign-out', isAuth, signOut);
router.get('/profile', isAuth,profile);
router.post('/create-entry',createEntry);
router.get('/get-entries/:userId',getEntriesByUserId);
router.patch('/exit-entry/:id',exitEntry);
router.get('/getCount/:userId',entryCount);


module.exports = router;
