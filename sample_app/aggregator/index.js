const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const VERB_PROVIDER_URL = process.env.VERB_PROVIDER_URL || "http://localhost:3002";
const NOUN_PROVIDER_URL = process.env.NOUN_PROVIDER_URL || "http://localhost:3001";

// Helper function to fetch data from a URL
async function fetchData(url, type) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type}: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(error.message);
    return null; // Return null if the fetch fails
  }
}

// Aggregator route to generate a sentence
app.get("/", async (req, res) => {
  const [nounResponse, verbResponse] = await Promise.all([
    fetchData(`${NOUN_PROVIDER_URL}/noun`, "noun"),
    fetchData(`${VERB_PROVIDER_URL}/verb`, "verb"),
  ]);

  if (nounResponse && verbResponse) {
    const sentence = `The ${nounResponse.noun} ${verbResponse.verb}`;
    res.json({ sentence });
  } else {
    res.status(500).json({ error: "Failed to fetch data from providers" });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Aggregator service running on port ${PORT}`);
});