const express = require('express');
const Signal = require('../models/signal');
const verifyToken = require('./middleware');


const signalRouter = express.Router();

//Post Method

const maxAge = 10800; // 3 hours in seconds
signalRouter.post('/addSignal',verifyToken ,async (req, res) => {
    res.cookie("jwt", res.locals.token, {
        httpOnly: true,
        maxAge: maxAge * 1000, // 3hrs in ms
      });
      const data = new Signal({
        vehicleQuantity: req.body.vehicleQuantity,
        isEmergencyVehicle: req.body.isEmergencyVehicle,
        location: {
            lat: req.body.location.lat,
            long: req.body.location.long,
            stream_link: req.body.location.stream_link
        }
    })
    

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
});


//Get all Method
signalRouter.get('/getAllSignals', verifyToken, async (req, res) => {
    try {
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only Admin Access' });
      }
      res.cookie("jwt", res.locals.token, {
        httpOnly: true,
        maxAge: maxAge * 1000, // 3hrs in ms
      });
      const data = await Signal.find();
      res.json(data);
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

//Get by ID Method
signalRouter.get('/getSignal', verifyToken, async (req, res) => {
    try {
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only Admin Access' });
      }
      res.cookie("jwt", res.locals.token, {
        httpOnly: true,
        maxAge: maxAge * 1000, // 3hrs in ms
      });
  
      const user = await Signal.findOne({ _id: req.query.id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(user);
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

//Update by ID Method
// signalRouter.patch('/update/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const updatedData = req.body;
//         const options = { new: true };

//         const result = await Signal.findByIdAndUpdate(
//             id, updatedData, options
//         )

//         res.send(result)
//     }
//     catch (error) {
//         res.status(400).json({ message: error.message })
//     }
// });

// //Delete by ID Method
// signalRouter.delete('/delete/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const data = await Signal.findByIdAndDelete(id)
//         res.send(`Document with ${data.name} has been deleted..`)
//     }
//     catch (error) {
//         res.status(400).json({ message: error.message })
//     }
// });

module.exports = signalRouter;
