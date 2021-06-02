const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const charactersController = require('../controllers/characters');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

//Post Routes - simplified for now
router.get('/:id', ensureAuth, charactersController.getCharacter);

router.post(
  '/createCharacter',
  upload.single('file'),
  charactersController.createCharacter
);

router.put('/favoriteCharacter/:id', charactersController.favoriteCharacter);
router.put('/unfavoriteCharacter/:id', charactersController.unfavoriteCharacter);
router.put('/editCharacter/:id', charactersController.editCharacter);

router.delete('/deleteCharacter/:id', charactersController.deleteCharacter);

module.exports = router;
