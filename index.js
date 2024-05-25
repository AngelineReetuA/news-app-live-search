let cats = [];
let articles = [];
let filtered = [];

let timeout;

const input = document
  .getElementById("searchIP")
  .addEventListener("input", (event) => {
    clearTimeout(timeout);
    const searchIP = event.target.value.trim();
    console.log(searchIP.length)
    timeout = setTimeout(() => {
      if (searchIP.length === 0) {
        console.log("search empty", articles)
        showCards(articles);
      }
      if (filtered.length != 0 && searchIP.length != 0){
        console.log("filter applied")
        filtered = filtered.filter((item) => {
          return (item.title + " " + item.description)
            .toLowerCase()
            .includes(searchIP.toLowerCase());
        });
      } else {
        console.log("filter not applied")
        filtered = articles.filter((item) => {
          return (item.title + " " + item.description)
            .toLowerCase()
            .includes(searchIP.toLowerCase());
        });
      }
     
      showCards(filtered);
    }, 750);
  });

fetch("http://localhost:3000/get-json")
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
  .then(async (jsonitems) => {
    const clearFilter = document.getElementById("clear");

    articles = jsonitems;

    jsonitems.forEach((item) => {
      if (
        item.title !== "" &&
        item.description !== "" &&
        item.link !== "" &&
        item.pubDate !== ""
      ) {
        cats.push(item.category);
      }
    });
    await showCards(articles);

    cats = new Set(cats);
    const drop = document.getElementById("drop");
    for (let cat of cats) {
      const li = document.createElement("li");
      li.classList.add("dropdown-item");
      li.appendChild(document.createTextNode(cat));
      drop.appendChild(li);
      li.addEventListener("click", async (event) => {
        let selectedOption = event.target.outerText;
        filtered = articles.filter(
          (item) => item.category === selectedOption
        );
        await showCards(filtered);
        clearFilter.disabled = false;
        clearFilter.addEventListener("click", async () => {
          await showCards(articles);
          clearFilter.disabled = true;
        });
      });
    }
  });

function showCards(articles) {
  const container = document.querySelector(".grid-container");
  container.innerHTML = "";
  // title, description, link, pubDate, category
  articles.forEach((item) => {
    if (
      item.title !== "" &&
      item.description !== "" &&
      item.link !== "" &&
      item.pubDate !== ""
    ) {
      const card = document.createElement("div");
      card.classList.add("card", "my-3");

      card.innerHTML = `
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.description}</p>
                <a href="${
                  item.link
                }" class="link-primary" target="_blank">View article</a>
              </div>
              <div class="card-footer">
                <small>Published on ${item.pubDate.slice(5)}</small>
              </div>
            `;

      container.appendChild(card);
    }
  });
}
