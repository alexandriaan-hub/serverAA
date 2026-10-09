import express from 'express';
import pagesRouter from './routes/pages.js';
import apiRouter from './routes/api.js';
import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import entriesRouter from './routes/entries.js';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set('views', 'views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// unit 9
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(morgan('dev'));

app.use('/entries', entriesRouter);

const ENTRIES_FILE = 'entries.json';

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

app.get('/hello/:name', (req, res) => {
  const name = req.params.name;
  res.send(`Hello, ${name}!`);
});

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});