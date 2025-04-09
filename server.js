const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Define the absolute path for monsters.json
const dataFilePath = path.join(__dirname, 'data', 'monsters.json');

// Ensure the monsters.json file exists and contains valid JSON
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, '[]', 'utf8');
  console.log("Created monsters.json file as it did not exist.");
}

// POST route to add a monster
app.post('/api/monsters', upload.single('image'), (req, res) => {
  try {
    const newMonster = {
      nom: req.body.nom,
      typeCreature: req.body.typeCreature,
      classeArmure: req.body.classeArmure,
      pointsVie: req.body.pointsVie,
      vitesse: req.body.vitesse,
      for: req.body.for,
      dex: req.body.dex,
      con: req.body.con,
      intelligence: req.body.intelligence,
      sag: req.body.sag,
      cha: req.body.cha,
      perception: req.body.perception,
      langues: req.body.langues,
      puissance: req.body.puissance,
      actions: req.body.actions,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      id: Date.now()
    };

    let monsters = [];
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      monsters = JSON.parse(fileData);
    }

    monsters.push(newMonster);
    fs.writeFileSync(dataFilePath, JSON.stringify(monsters, null, 2));
    console.log(`Monster added: ${newMonster.nom}`);
    res.json({ success: true, monster: newMonster });
  } catch (error) {
    console.error('Error saving monster:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET route to retrieve all monsters
app.get('/api/monsters', (req, res) => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return res.json([]);
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const monsters = JSON.parse(fileData);
    res.json(monsters);
  } catch (error) {
    console.error('Error reading monsters:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✨ Server running at http://localhost:${PORT}`);
});
