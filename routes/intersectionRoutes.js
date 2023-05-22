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
  const { signals, name, location } = req.body;

  try {
    const existingIntersection = await Intersection.findOne({ name });
    if (existingIntersection) {
      return res.status(409).json({ message: 'Intersection with the same name already exists' });
    }

    const createdSignals = await Promise.all(
      signals.map(async (signalData) => {
        const { location, stream_link } = signalData;
        const existingSignal = await Signal.findOne({ location, stream_link });
        if (existingSignal) {
          return existingSignal;
        } else {
          const newSignal = new Signal(signalData);
          return newSignal.save();
        }
      })
    );

    const newIntersection = new Intersection({
      name,
      location,
      signals: createdSignals,
    });

    const savedIntersection = await newIntersection.save();
    res.status(200).json(savedIntersection);
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
