const API_KEY = `802b0b4ba9d44b078e2a3d0925cc42cb`;
const url1 = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
const url2 = "https://re-times.netlify.app/top-headlines";
let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

const getLatestNews = async () => {
  const url = new URL(url2);

  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
  console.log("ddddd", newsList);
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log("category");
  const url = new URL(
    `https://re-times.netlify.app/top-headlines?country=kr&category=${category}`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("Dddddd", data);
  newsList = data.articles;
  render();
};
/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

const getNewsBykeyword = async () => {
  const keyword = document.getElementById("search-input");
  console.log("keyword");
  const url = new URL(
    `https://re-times.netlify.app/top-headlines?country=kr&q=${keyword}`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("keyword data", data);
  newsList = data.articles;
  render();
};
const render = () => {
  const newsHTML = newsList
    .map(
      (news) => `<div class="row news">
  <div class="col-lg-4">
    <img class"news-img-size" src=${news.urlToImage} />
  </div>
  <div class="col-lg-8">
    <h2>${news.title}</h2>
    <p>${news.description}</p>
    <div>${news.source.name} * ${news.publishedAt}</div>
  </div>
</div>`
    )
    .join(" ");

  document.getElementById("news-board").innerHTML = newsHTML;
};

getLatestNews();
