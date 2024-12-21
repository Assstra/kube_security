const express = require("express");
const verbs = require("./verbs.json");

const app = express();
const PORT = process.env.PORT || 3002;
const WORD_TYPE = process.env.WORD_TYPE;

app.get("/verb", (req, res) => {
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
    res.json({ verb: randomVerb });
});

// Health check route
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Random Verb Service running on port ${PORT}`);
});
