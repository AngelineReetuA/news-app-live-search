const url = "https://www.thehindu.com/feeder/default.rss";
const json = [];
let jsonitem = {};
const div = document.getElementById("feed");

async function pullFeed() {
  try {
    // const response = await axios.get(url)
    // return response.data
    const response = await fetch(url, {
      method: "GET",
    })
      .then((response) => response.text())
      .then((string) => {
        const xmlDoc = new DOMParser().parseFromString(string, "text/xml");
        const rss = xmlDoc.querySelector("rss");
        const channel = rss.querySelector("channel");
        const title = channel.querySelector("title").textContent;
        const items = channel.querySelectorAll("item");
        for (i=0;i<items.length;i++){
          console.log(items[i])
          let item = items[i]
          jsonitem.title = item.childNodes[0].textContent;
          jsonitem.description = item.childNodes[1].textContent;
          jsonitem.link = item.childNodes[2].textContent;
          jsonitem.cat = item.childNodes[4].textContent;
          jsonitem.pubDate = item.childNodes[5].textContent;
          json.push(jsonitem);
          jsonitem = {}
        }
        console.log(json);
      });
  } catch (error) {
    console.log("Error", error);
  }
}

async function display() {
  let feed;
  await pullFeed();
}

display();
