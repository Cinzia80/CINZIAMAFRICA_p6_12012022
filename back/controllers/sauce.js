//--------------//
// Import model //
//--------------//
const Sauce = require('../models/sauce');
//----------------------------//
// Import file system package //
//----------------------------//
const fs = require('fs');
//-------------------------------------//
// Exports the logic of the POST route //
//-------------------------------------//
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() =>
      res.status(201).json({ message: 'Sauce created successfully.' })
    )
    .catch((error) => res.status(400).json({ error }));
};
//-------------------------------------//
// Exports the logic of the GET route  //
//-------------------------------------//
exports.readSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};
//-------------------------------------//
// Exports the logic of the PUT route  //
//-------------------------------------//
exports.updateSauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        // Delete the previous image before saving the new one
        const fileName = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${fileName}`, () => {
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${
              req.file.filename
            }`,
          };
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() =>
              res.status(200).json({ message: 'Sauce updated successfully.' })
            )
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    const sauceObject = { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() =>
        res.status(200).json({ message: 'Sauce updated successfully.' })
      )
      .catch((error) => res.status(400).json({ error }));
  }
};
//---------------------------------------//
// Exports the logic of the DELETE route //
//---------------------------------------//
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() =>
            res.status(200).json({ message: 'Sauce deleted successfully.' })
          )
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
//-----------------------------------------------//
// Exports the logic of the GET all sauces route //
//-----------------------------------------------//
exports.readAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
//---------------------------------------------//
// Exports the logic of the like/dislike route //
// Case number 1 to add a like                 //
// Case number 0 to remove a like or a dislike //
// Case number -1 to add a dislike             //
//---------------------------------------------//
exports.likeDislike = (req, res, next) => {
  const like = req.body.like;
  // switch evaluates an expression and, depending on the result obtained and the associated case, executes the corresponding statements.
  switch (like) {
    case 1:
      Sauce.updateOne(
        { _id: req.params.id },
        { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }
      )
        .then(() =>
          res.status(200).json({ message: 'Like added successfully.' })
        )
        .catch((error) => res.status(400).json({ error }));
      break;
    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
            )
              .then(() =>
                res.status(200).json({ message: 'Like deleted successfully.' })
              )
              .catch((error) => res.status(400).json({ error }));
          }
          if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $pull: { usersDisliked: req.body.userId },
                $inc: { dislikes: -1 },
              }
            )
              .then(() =>
                res
                  .status(200)
                  .json({ message: 'Dislike deleted successfully.' })
              )
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error }));
      break;
    case -1:
      Sauce.updateOne(
        { _id: req.params.id },
        { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }
      )
        .then(() => {
          res.status(200).json({ message: 'Dislike added successfully.' });
        })
        .catch((error) => res.status(400).json({ error }));
      break;
  }
};
