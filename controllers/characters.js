const cloudinary = require('../middleware/cloudinary');
const Character = require('../models/Character');

module.exports = {
  getProfile: async (req, res) => {
    try {
      const characters = await Character.find({ user: req.user.id });
      res.render('profile.ejs', { characters: characters, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const characters = await Character.find()
        .sort({ createdAt: 'desc' })
        .lean();
      res.render('feed.ejs', { characters: characters });
    } catch (err) {
      console.log(err);
    }
  },
  getDashboard: async (req, res) => {
    try {
      const characters = await Character.find()
        .sort({ favorite: 'desc', createdAt: 'desc' })
        .lean();
      res.render('dashboard.ejs', { characters: characters, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getCharacter: async (req, res) => {
    try {
      const characters = await Character.findById(req.params.id);
      res.render('character.ejs', { characters: characters, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createCharacter: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Character.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        game: req.body.game,
        notes: req.body.notes,
        favorite: false,
        user: req.user.id,
      });
      console.log('Character has been added!');
      res.redirect('/dashboard');
    } catch (err) {
      console.log(err);
    }
  },
  favoriteCharacter: async (req, res) => {
    try {
      await Character.findOneAndUpdate(
        { _id: req.params.id },
        {
          favorite: true,
        }
      );
      console.log('Character has been marked as a favorite!');
      res.redirect('/dashboard');
    } catch (err) {
      console.log(err);
    }
  },
  unfavoriteCharacter: async (req, res) => {
    try {
      await Character.findOneAndUpdate(
        { _id: req.params.id },
        {
          favorite: false,
        }
      );
      console.log('Character has been removed as a favorite!');
      res.redirect('/dashboard');
    } catch (err) {
      console.log(err);
    }
  },
  deleteCharacter: async (req, res) => {
    try {
      // Find post by id
      let characters = await Character.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(characters.cloudinaryId);
      // Delete post from db
      await Character.remove({ _id: req.params.id });
      console.log('Deleted Character');
      res.redirect('/dashboard');
    } catch (err) {
      res.redirect('/dashboard');
    }
  },
  editCharacter: async (req, res) => {
    try {
      console.log(req.body)
      await Character.findOneAndUpdate({ _id: req.params.id }, { name: req.body.name, game: req.body.game,
        notes: req.body.notes}, 
        {
          new: true,
          runValidators: true
        })
      console.log('Character has been editted!')
      location.reload();
    } catch (err) {
      res.redirect('/dashboard')
    }
  },
};
