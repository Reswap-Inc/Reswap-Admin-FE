const express = require('express');

const path = require('path');

 

const app = express();

const PORT = 4001;

 

// // React build

// const staticReactPath = path.join(__dirname, 'build');

// app.use('/web/admin/home', express.static(staticReactPath));

// app.use(express.static(path.join(__dirname, 'public')));

// // Serve hydrogen folder (inside public)
// app.use('/web/admin/hydrogen', express.static(path.join(__dirname, 'build', 'hydrogen')));

 

// // React SPA fallback route

// app.get(/\/web\/admin\/home\/.*/, (req, res) => {

//   res.sendFile(path.join(staticReactPath, 'index.html'));

// });

// Path to React build folder
const staticReactPath = path.join(__dirname, 'build');

// Serve React static files
app.use('/web/admin', express.static(staticReactPath));

// Serve any other static files (like public assets)
app.use(express.static(path.join(__dirname, 'public')));

// Optional: Serve hydrogen assets (if inside build)
app.use('/web/admin/hydrogen', express.static(path.join(__dirname, 'build', 'hydrogen')));
// app.use('/web/admin/firebase-messaging-sw.js', express.static(path.join(__dirname, 'build', 'firebase')));


app.get('/firebase-messaging-sw.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'firebase-messaging-sw.js'));
});

   // Explicitly serve the Firebase Messaging service worker at the root
  //  app.get('/firebase-messaging-sw.js', (req, res) => {
  //    res.sendFile(path.join(__dirname, 'build', 'firebase-messaging-sw.js'));
  //  });

// Catch-all route for React SPA (for any route under /web/admin/*)
app.get('/web/admin/{*splat}', (req, res) => {
  res.sendFile(path.join(staticReactPath, 'index.html'));
});

// Optional fallback to root path
app.get('{*splat}', (req, res) => {
  res.redirect('/web/admin/home');
});

 

app.listen(PORT, () => {

  console.log(`React app at http://localhost:${PORT}/web/admin/home`);

  console.log(`Hydrogen assets at http://localhost:${PORT}/web/admin/hydrogen/config.json`);

});