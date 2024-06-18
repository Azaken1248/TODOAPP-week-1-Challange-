import express from 'express';
import bodyParser from 'body-parser';
import { existsSync, mkdirSync, writeFile, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

app.use(bodyParser.json());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200); 
  } else {
    next();
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Endpoint to save tasks
// Endpoint to save tasks
app.post('/save-tasks', (req, res) => {
    const { username, tasksData } = req.body;
  
    if (!username || !tasksData) {
      return res.status(400).send('Username and tasksData are required');
    }
  
    const userDir = join(__dirname, 'users');
    const userFile = join(userDir, `${username}.json`);
  
    if (!existsSync(userDir)) {
      mkdirSync(userDir);
    }
  
    let existingTasks = {};
    if (existsSync(userFile)) {
      const fileContent = readFileSync(userFile, 'utf8');
      existingTasks = JSON.parse(fileContent);
    }
  
    const updatedTasks = {
      ...existingTasks,
      ...tasksData
    };
  
    try {
      writeFileSync(userFile, JSON.stringify(updatedTasks, null, 2));
      res.status(200).send(`Tasks saved for ${username}`);
    } catch (error) {
      console.error('Error saving tasks:', error);
      res.status(500).send('Error saving tasks');
    }
  });
  
// Endpoint to save user data
app.post('/save-user', (req, res) => {
  const { currentUser } = req.body;

  if (!currentUser) {
    return res.status(400).send('currentUser is required');
  }

  const userDir = join(__dirname, 'users');
  const userFile = join(userDir, `${currentUser}.json`);

  if (!existsSync(userDir)) {
    mkdirSync(userDir);
  }

  // Check if user file already exists
  if (existsSync(userFile)) {
    return res.status(200).send(`User file already exists for ${currentUser}`);
  }

  // Example user data to save
  const userData = {};

  writeFile(userFile, JSON.stringify(userData, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error saving user data');
    }

    res.status(200).send(`User data saved for ${currentUser}`);
  });
});

// Endpoint to fetch tasks
app.get('/fetch-tasks/:username', (req, res) => {
  const { username } = req.params;

  const userFile = join(__dirname, 'users', `${username}.json`);

  if (!existsSync(userFile)) {
    return res.status(404).send('Tasks not found for this user');
  }

  const tasksData = JSON.parse(readFileSync(userFile, 'utf8'));
  res.status(200).json(tasksData);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
