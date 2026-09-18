import express from 'express';
import pagesRouter from './routes/pages.js';
import apiRouter from './routes/api.js';
import { join } from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(join(import.meta.dirname, 'public', 'index.html'));
});

app.use('/', pagesRouter);
app.use('/api', apiRouter);

// from reading portion unit 3, works:
app.get('/entries', (req, res) => {
  const entries = [
    { title: 'First note' },
    { title: 'Second note' },
    { title: 'Third note' },
  ];
  res.render('entries', { title: 'My Notes', entries });
});


const events = [
  { title: 'Career fair' },
  { title: 'Hackathon kickoff' },
];

app.get('/events', (req, res) => {
  res.render('events', { events });
});


const projects = [
  { name: 'Weather app', tag: 'javascript' },
  { name: 'Portfolio site', tag: 'express' },
  { name: 'Budget tracker', tag: 'python' },
];

 // if it's not possible to put multiple items in tag, just go forward with 'tag', like this:
app.get('/projects', (req, res) => {
  const tag = req.query.tag || null;
  const sort = req.query.sort || null;

  if(tag == null) {
      if(sort == "alphabetic") { // can also make a list of sorting types and see if they match
        res.send(projects.sort((a, b) => a.name.localeCompare(b.name)));
        return;
      }
    res.send(projects);
    return;
  }

  for(let i = 0; i < projects.length; i++) {
    if(projects[i].tag == tag) {
      res.send(projects[i]);
      return;
    }
  }
  
  // if no match was found
  res.send("No projects found with that tag.");
});

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});