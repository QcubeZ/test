const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

// Use CORS middleware
app.use(cors());

// Root route
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Novel Scraper API! Use /scrape to get novel data or /search?q=NovelName for searching."
  );
});

// Scrape route
app.get("/scrape", async (req, res) => {
  try {
    const response = await axios.get("https://novelbuddy.com/latest");
    const html = response.data;
    const $ = cheerio.load(html);

    const novels = [];
    $(".book-item").each((index, element) => {
      const link = $(element).find("a").attr("href");
      const title = link ? link.replace("/novel/", "").replace(/-/g, " ") : "";
      const image = `https://static.novelbuddy.com/images/${title.replace(
        / /g,
        "-"
      )}.png`;
      const summary = $(element).find(".summary").text().trim(); // Adjust the class selector as needed

      novels.push({ title, image, summary });
    });

    res.json(novels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

// Search route
app.get("/search", async (req, res) => {
  const { q } = req.query; // Get the query parameter from the request

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const response = await axios.get(
      `https://novelbuddy.com/search?q=${encodeURIComponent(q)}`
    );
    const html = response.data;
    const $ = cheerio.load(html);

    const novels = [];
    $(".book-item").each((index, element) => {
      const link = $(element).find("a").attr("href");
      const title = link ? link.replace("/novel/", "").replace(/-/g, " ") : "";
      const image = `https://static.novelbuddy.com/images/${title.replace(
        / /g,
        "-"
      )}.png`;
      const summary = $(element).find(".summary").text().trim(); // Adjust the class selector as needed

      novels.push({ title, image, summary });
    });

    res.json(novels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
