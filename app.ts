import express from "express";

const HOSTNAME = "127.0.0.1";
const PORT = 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to SubHub API");
});

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running on http://${HOSTNAME}:${PORT}`);
});
