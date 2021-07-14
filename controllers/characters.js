const cloudinary = require('../middleware/cloudinary');
const Character = require('../models/Character');

module.exports = {
  getAccount: async (req, res) => {
    try {
      const characters = await Character.find({ user: req.user.id });
      res.render('account.ejs', { characters: characters, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // getDemo: async (req, res) => { // working on getting a demo button - in progress
  //   try {
  //     const characters = await Character.find();
  //     console.log(DEFAULT_USER)
  //     res.render('dashboard.ejs', { characters: characters, user: req.DEFAULT_USER });
  //   } catch (err) {
  //     console.log(err);
  //     res.render('error/500.ejs')
  //   }
  // },
  // getFeed: async (req, res) => { // favorites feed removed temporarily
  //   try {
  //     const characters = await Character.find()
  //       .sort({ favorite: 'desc' })
  //       .lean();
  //     res.render('favfeed.ejs', { characters: characters });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  getDashboard: async (req, res) => {
    try {
      const characters = await Character.find()
        .sort({ favorite: 'desc', name: 'asc' })
        .lean();
      res.render('dashboard.ejs', { characters: characters, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getNewChar: async (req, res) => {
    try {
      const characters = await Character.find()
        .sort({ favorite: 'desc', createdAt: 'desc' })
        .lean();
      res.render('newchar.ejs', { characters: characters, user: req.user });
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
      res.render('error/404.ejs')
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
      res.render('error/404.ejs')
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
      res.render('error/404.ejs')
    }
  },
  editCharacter: async (req, res) => {
    try {
      await Character.findOneAndUpdate(
        { _id: req.params.id }, {
          name: req.body.name, 
          game: req.body.game,
          notes: req.body.notes
        },
        {
          new: true,
          runValidators: true
        })
      console.log('Character has been editted!')
      res.redirect('/dashboard')
    } catch (err) {
      console.log(err);
      res.render('error/404.ejs')
    }
  },
  deleteCharacter: async (req, res) => {
    try {
      // Find character by id
      let characters = await Character.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(characters.cloudinaryId);
      // Delete character from db
      await Character.deleteOne({ _id: req.params.id });
      console.log('Deleted Character');
      res.redirect('/dashboard');
    } catch (err) {
      res.render('error/404.ejs')
    }
  },
};
