const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const PDFDocument = require('pdfkit');

const app = express();
const port = 5000;

const pool = new Pool({
  user: 'your-username',
  host: 'localhost',
  database: 'your-database',
  password: 'your-password',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/tasks', async (req, res) => {
  const { description } = req.body;
  try {
    await pool.query('INSERT INTO tasks (description, completed) VALUES ($1, $2)', [description, false]);
    res.status(201).send('Task added');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.send('Task deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    await pool.query('UPDATE tasks SET completed = $1 WHERE id = $2', [completed, id]);
    res.send('Task updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/download', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    const tasks = result.rows;

    const doc = new PDFDocument();
    doc.pipe(res);

    tasks.forEach(task => {
      doc.text(`${task.description} - ${task.completed ? 'Completed' : 'Pending'}`);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
