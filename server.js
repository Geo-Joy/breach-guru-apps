const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("dist"));

app.get("/api/apps", (req, res) => {
  const appsDir = path.join(__dirname, "apps");
  const apps = fs
    .readdirSync(appsDir)
    .filter((file) => file.endsWith(".js"))
    .map((file) => file.replace(".js", ""));
  res.json(apps);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
