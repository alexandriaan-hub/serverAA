import express from 'express';
import pagesRouter from './routes/pages.js';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/', pagesRouter);
app.use('/api', apiRouter);

const projects = [
  { name: 'Weather app', tag: 'javascript' },
  { name: 'Portfolio site', tag: 'express' },
  { name: 'Budget tracker', tag: 'python' },
];

// app.get('/projects', (req, res) => {
//   const tag = req.query.tag || null;
//   const sort = req.query.sort || null;

//   if(tag == null) {
//       if(sort == "alphabetic") { // can also make a list of sorting types and see if they match
//         res.send(projects.sort((a, b) => a.name.localeCompare(b.name)));
//         return;
//       }
//     res.send(projects);
//     return;
//   }

//   const out = []; // new list for whichever projects are given
//   for(let i = 0; i < projects.length; i++) {
//     if(projects[i].tag == tag) {
//       out.push(projects[i]);
//       // res.send(projects[i]);
//       // return;
//     }
//   }
//   // if it's not possible to put multiple items in tag, just go forward with 'tag', like this:



//   if(out.length == 0) { // if a tag parameter is given, but doesn't match any of the given projects
//     res.send("No projects found with that tag.");
//     return; 
//   }

//   // sort based on sort parameter here
//   if(sort == "alphabetic") {
//     res.send(out.sort((a, b) => a.name.localeCompare(b.name)));
//     return;
//   }

//   res.send(out); // if no sort is given
// });

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