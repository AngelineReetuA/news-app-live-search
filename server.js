import express from "express";
import fetch from "node-fetch";
import { parseString } from "xml2js"; // Import parseString function from xml2js
import path from "path";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const currentDir = path.dirname(new URL(import.meta.url).pathname);
  const filePath = path.resolve(currentDir, "index.html");
  res.sendFile(filePath);
});


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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
