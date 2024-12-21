const express = require("express");
const nouns = require("./nouns.json");

const app = express();
const PORT = process.env.PORT || 3001;
const WORD_TYPE = process.env.WORD_TYPE;

app.get("/noun", (req, res) => {
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    res.json({ noun: randomNoun });
});

// Health check route
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Random Noun Service running on port ${PORT}`);
});
