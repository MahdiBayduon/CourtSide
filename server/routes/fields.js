const router = require('express').Router();
const Field = require('../models/Field');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all fields
router.get('/', async (req, res) => {
  try {
    const fields = await Field.find();
    res.json(fields);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new field (admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const { name, type, pricePerHour } = req.body;
    const newField = new Field({
      name,
      type,
      pricePerHour,
    });

    const field = await newField.save();
    res.json(field);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a field (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const { name, type, pricePerHour } = req.body;
    let field = await Field.findById(req.params.id);

    if (!field) return res.status(404).json({ msg: 'Field not found' });

    field.name = name;
    field.type = type;
    field.pricePerHour = pricePerHour;

    await field.save();
    res.json(field);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a field (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    let field = await Field.findById(req.params.id);

    if (!field) return res.status(404).json({ msg: 'Field not found' });

    await field.remove();
    res.json({ msg: 'Field removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;