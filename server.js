// this is the entry point for the server.

// initialize express
const express = require("express");
// initialize the app
const app = express();
// initialize ytdl dependancy
const ytdl = require("ytdl-core");

//set the view engine to ejs
app.set("view engine", "ejs");

// add your routes here
app.get("/", (req, res) => {
  // this is the route for the home page
  res.render("index");
});

app.get("/download", async (req, res) => {
  // check if the url is valid
  if (!req.query.url) {
    res.status(400).render("index", {
      error: "Please enter a valid url",
    });
    return;
  }
  // this is the route for the download page
  // an example of a url: https://www.youtube.com/watch?v=f2EqECiTBL8&t=9899s
  // https://www.youtube.com/embed/f2EqECiTBL8
  // the query string is v=f2EqECiTBL8&t=9899s
  //the split method splits the string at the "v=" and returns an array with the first element being the string before the "v=" and the second element being the string after the "v="
  const videoId = req.query.url.split("v=")[1];
  const videoIdwithoutT = videoId.split("&")[0];
  // the ytdl.getInfo method takes a video id and returns a promise
  const info = await ytdl.getInfo(req.query.url);
  // the info object contains the title, description, author, etc.
  console.log(`url: https://www.youtube.com/embed/${videoIdwithoutT}`);
  return res.render("download", {
    //   "https://www.youtube.com/embed/gzdQDxzW2Tw
    src: `https://www.youtube.com/embed/${videoIdwithoutT}`,
    title: info.title,
    description: info.description,
    // mimeType: info.mimeType,
    formats: info.formats.sort((a, b) => {
      return a.mimeType < b.mimeType ? -1 : a.mimeType > b.mimeType ? 1 : 0;
    }),
  });
});

// this is the port number for the server
const PORT = process.env.PORT || 5000;

// start the server
// TODO: Install nodemon as a dev dependancy for you to run this server in development mode.
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
