const express = require('express');
const Intersection = require('../models/intersection');

const router = express.Router();

// Post Method
// Post Method
router.post('/post', async (req, res) => {
  const existingData = await Intersection.findOne({ _id: req.body._id });
  if (existingData) {
    return res.status(409).json({ message: 'Document with same ID already exists' });
  }

  const data = new Intersection({
    name: req.body.name,
    _id: req.body._id,
    location: {
      lat: req.body.location.lat,
      long: req.body.location.long,
    },
    signals: req.body.signals,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get by ID Method
router.get('/getOne/:id', async (req, res) => {
  try {
    const data = await Intersection.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update by ID Method
router.patch('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Intersection.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Intersection.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
