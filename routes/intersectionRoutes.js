const express = require('express');
const Intersection = require('../models/intersection');
const Signal = require('../models/signal');
const verifyToken = require('./middleware');

const router = express.Router();
const maxAge = 10800; // 3 hours in seconds

router.post('/addIntersection', verifyToken, async (req, res) => {
  res.cookie('jwt', res.locals.token, {
    httpOnly: true,
    maxAge: maxAge * 1000, // 3hrs in ms
  });
  const existingData = await Intersection.findOne({ _id: req.body._id });
  if (existingData) {
    return res.status(409).json({ message: 'Document with same ID already exists' });
  }

  // Check if all signals exist
  const signalIds = req.body.signals;
  const signals = await Signal.find({ _id: { $in: signalIds } });
  if (signals.length !== signalIds.length) {
    return res.status(400).json({ message: 'One or more signals do not exist' });
  }

  const data = new Intersection({
    name: req.body.name,
    _id: req.body._id,
    location: {
      lat: req.body.location.lat,
      long: req.body.location.long,
    },
    signals: signalIds,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Get by ID Method
router.get('/getAllIntersections', verifyToken, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Only Admin Access' });
  }
  try {
    res.cookie("jwt", res.locals.token, {
      httpOnly: true,
      maxAge: maxAge * 1000, // 3hrs in ms
    });
    const data = await Intersection.find();
    res.json(data);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/getIntersection', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only Admin Access' });
    }
    res.cookie("jwt", res.locals.token, {
      httpOnly: true,
      maxAge: maxAge * 1000, // 3hrs in ms
    });

    const user = await Intersection.findOne({ _id: req.query.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// // Update by ID Method
// router.patch('/update/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const updatedData = req.body;
//     const options = { new: true };

//     const result = await Intersection.findByIdAndUpdate(id, updatedData, options);

//     res.send(result);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Delete by ID Method
// router.delete('/delete/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const data = await Intersection.findByIdAndDelete(id);
//     res.send(`Document with ${data.name} has been deleted..`);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

module.exports = router;
