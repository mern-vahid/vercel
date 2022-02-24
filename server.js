const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome To Express Js App");
});

const PORT = process.env.PORT || 7070;

app.listen(PORT, () =>
  console.log(`Server Is Runing => http://localhost:${PORT}/`)
);
