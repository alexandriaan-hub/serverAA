import express from 'express';
import pagesRouter from './routes/pages.js';
import apiRouter from './routes/api.js';
import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set('views', 'views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ENTRIES_FILE = 'entries.json';

const readEntries = async (entries) => {
  const data = await readFile(ENTRIES_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeEntries = async (entries) => {
  await writeFile(ENTRIES_FILE, JSON.stringify(entries, null, 2));
};

const wishlist = [];

app.post('/wishlist', (req, res) => {
  const { item, note } = req.body;
  // your decision goes here
  const newItem = { item, note };
  wishlist.push(newItem);
  res.status(201).json(newItem);
});

app.get('/', (req, res) => {
  res.sendFile(join(import.meta.dirname, 'public', 'index.html'));
});

app.use('/', pagesRouter);
app.use('/api', apiRouter);

const entries = [
    { title: 'First note', body: 'Notes from the first session.'},
    { title: 'Second note', body: 'Notes from the second session.'},
    { title: 'Third note', body: 'Notes from the third session.'},
  ];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // unit 7

app.get('/slow', async (req, res) => { // unit 7
  await wait(5000);
  res.send('Done waiting.');
});

// ver of below from unit 6
app.get('/entries', async (req, res) => {
  const entries = await readEntries();
  res.set('Cache-Control', 'public, max age=60'); // from home exercise
  res.set('X-Total-Count', entries.length);
  res.status(200).render('entries', { title: 'My Notes', entries });
})

// first seen in unit 3
// app.get('/entries', (req, res) => {
//   res.render('entries', { title: 'My Notes', entries });
// });

// original from unit 5, w/o home exercise
// app.post('/entries', (req, res) => {
//   const { title, body } = req.body;
//   const newEntry = { title, body };
//   entries.push(newEntry);
//   res.status(201).json(newEntry);
// });

// the 2 functs below are from unit 5 home exercise
app.post('/entries', async (req, res) => {
  const { title, body } = req.body;
  if(!title || !body) {
    res.status(400).json({ error: 'title and body are required'});
    return;
  }
  const data = await readFile(DATA_FILE, 'utf-8');
  // const entries = await readEntries();
  const entries = JSON.parse(data);
  const newEntry = { title, body };
  entries.push(newEntry);
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
  res.status(201).json(newEntry);
});

// unit 8
app.post('/entries/classic', async (req, res) => {
  const { title, body } = req.body;
  if(!title || !body) {
    res.status(400).json({ error: 'title and body are required'});
    return;
  }
  const data = await readFile(DATA_FILE, 'utf-8');
  const entries = JSON.parse(data);
  entries.push({ title, body });
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
  res.redirect('/entries');
});

// removes an entry by its position in the array
app.delete('/entries/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const data = await readFile(DATA_FILE, 'utf-8');
  const entries = JSON.parse(data);
  // const entries = await readEntries();
  if (Number.isNaN(id) || id < 0 || id >= entries.length) {
    res.status(404).json({ error: 'Entry not found' });
    return;
  }
  entries.splice(id, 1);
  // await writeEntries(entries);
  await writeFile(DATA_FILE, JSON.stringify(entries, null , 2));
  res.status(204).send();
});

// 2 functs below are unit 7 home exercise
app.get('/random-post', async (req, res) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  const post = await response.json();
  res.status(200).json(post);
});

app.get('/three-posts', async (req, res) => {
  const ids = [1, 2, 3];
  const titles = [];
  for(const id of ids) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    const post = await response.json();
    titles.push(post.title);
  }
  res.status(200).json({ titles });
});

const events = [
  { title: 'Career fair' },
  { title: 'Hackathon kickoff' },
];

app.get('/events', (req, res) => {
  res.render('events', { events });
});

// app.get("/about", (req, res) => {
//   res.render("about", { title: "About" });
// });

app.get('/hello/:name', (req, res) => {
  const name = req.params.name;
  res.send(`Hello, ${name}!`);
});

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});