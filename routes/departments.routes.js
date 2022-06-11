const express = require('express');
const router = express.Router();
// const db = require('./../db');
const ObjectId = require('mongodb').ObjectId;

// router.get('/departments', (req, res) => {
//   res.json(db.departments);
// });

router.get('/departments', (req, res) => {
  req.db.collection('departments').find().toArray((err, data) => {
    if(err) res.status(500).json({ message: err });
    else res.json(data);
  });
});

// router.get('/departments/random', (req, res) => {
//   res.json(db.departments[Math.floor(Math.random() * db.length)]);
// });

router.get('/departments/random', (req, res) => {
  req.db.collection('departments').aggregate([ { $sample: { size: 1 } } ]).toArray((err, data) => {
    if(err) res.status(500).json({ message: err });
    else res.json(data[0]);
  });
});

// router.get('/departments/:id', (req, res) => {
//   res.json(db.departments.find(item => item.id == req.params.id));
// });

router.get('/departments/:id', (req, res) => {
  req.db.collection('departments').findOne({ _id: ObjectId(req.params.id) }, (err, data) => {
    if(err) res.status(500).json({ message: err });
    else if(!data) res.status(404).json({ message: 'Not found' });
    else res.json(data);
  });
});

// router.post('/departments', (req, res) => {
//   const { name } = req.body;
//   db.departments.push({ id: 3, name })
//   res.json({ message: 'OK' });
// });

router.post('/departments', (req, res) => {
  const { name } = req.body;
  req.db.collection('departments').insertOne({ name: name }, err => {
    if (err) res.status(500).json({ message: err });
    else res.json({ message: 'OK' });
  })
});

// router.put('/departments/:id', (req, res) => {
//   const { name } = req.body;
//   db = db.departments.map(item => (item.id == req.params.id) ? { ...item, name } : item );
//   res.json({ message: 'OK' });
// });

router.put('/departments/:id', (req, res) => {
  const { name } = req.body;
  req.db.collection('departments').updateOne({ _id: ObjectId(req.params.id) }, { $set: { name: name }}, err => {
    if (err) res.status(500).json({ message: err });
    else res.json({ message: 'OK' });
  })
});

// router.delete('/departments/:id', (req, res) => {
//   db = db.departments.filter(item => item.id != req.params.id)
//   res.json({ message: 'OK' });
// });

router.delete('/departments/:id', (req, res) => {
  req.db.collection('departments').deleteOne({ _id: ObjectId(req.params.id) }, err => {
    if (err) res.status(500).json({ message: err });
    else res.json({ message: 'OK' });
  })
});

module.exports = router;
