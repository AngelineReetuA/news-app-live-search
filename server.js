import express from "express";
import fetch from "node-fetch";
import { parseString } from "xml2js";
import { fileURLToPath } from 'url';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  // Assuming index.html is in the root directory
  res.sendFile(path.join(__dirname, 'index.html'));
});

// CORS setup...
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/get-json", async (req, res) => {
  const url = "https://www.thehindu.com/feeder/default.rss";
  try {
    const response = await fetch(url);
    const xmlString = await response.text();

    // Parse XML string using xml2js
    parseString(xmlString, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
        res.status(500).send({ message: "Error parsing XML" });
        return;
      }

      const items = result.rss.channel[0].item;
      const json = items.map((item) => ({
        title: item.title[0],
        description: item.description[0],
        link: item.link[0],
        category: item.category[0],
        pubDate: item.pubDate[0],
      }));
      res.status(200).send(json);
    });
  } catch (error) {
    console.log("Error", error);
    res.status(400).send({ message: "Error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
