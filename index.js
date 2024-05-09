let cats = [];

fetch("http://localhost:3000/get-json")
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
  .then(async (jsonitems) => {
    const container = document.querySelector(".grid-container");

    // title, description, link, pubDate, category
    jsonitems.forEach((item) => {
      if (
        item.title !== "" &&
        item.description !== "" &&
        item.link !== "" &&
        item.pubDate !== ""
      ) {
        const card = document.createElement("div");
        card.classList.add("card", "my-3");

        cats.push(item.category);

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
    cats = new Set(cats);
    const drop = document.getElementById("drop");
    console.log(cats);
    console.log(typeof cats);
    for (let cat of cats) {
      console.log(cat);
      const li = document.createElement("li");
      li.classList.add("dropdown-item");
      li.appendChild(document.createTextNode(cat));
      drop.appendChild(li);
    }
  });
function search(jsonitems) {
  const input = document.getElementById("searchIP").value;
}
