const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Save text
app.post("/save", (req, res) => {
    const content = req.body.text;

    fs.writeFile("data.txt", content, (err) => {
        if (err) return res.send("Error saving");
        res.send("Saved successfully!");
    });
});

// Get text
app.get("/get", (req, res) => {
    fs.readFile("data.txt", "utf8", (err, data) => {
        if (err) return res.send("");
        res.send(data);
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});