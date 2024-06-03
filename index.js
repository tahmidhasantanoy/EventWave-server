const express = require("express");
const app = express();
const port = 3000;

// Middlware

app.get("/", (req, res) => {
  res.send("EventWave...");
});

app.listen(port, () => {
  console.log(`EventWave is waving ... ${port}`);
});
