const API_KEY = `802b0b4ba9d44b078e2a3d0925cc42cb`;
const url1 = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
const url2 = "https://re-times.netlify.app/top-headlines";
let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);
let url = new URL(`https://re-times.netlify.app/top-headlines`);
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

// 메뉴 클릭
menus.forEach((menu) =>
  menu.addEventListener("click", (e) =>
    fetchNews({ category: e.target.textContent.toLowerCase() })
  )
);

// 검색
document.getElementById("search-button").addEventListener("click", () => {
  const keyword = document.getElementById("search-input").value;
  fetchNews({ keyword });
});

async function fetchNews({ category = "", keyword = "" } = {}) {
  let baseurl = new URL(url2);
  if (category) baseurl += `&category=${category}`;
  if (keyword) baseurl += `&q=${keyword}`;

  try {
    baseurl.searchParams.set("page", page); // &page=page
    baseurl.searchParams.set("pageSize", pageSize); // &pageSize=pageSize
    const response = await fetch(baseurl);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
}

const render = () => {
  const newsHTML = newsList
    .map(
      (news) =>
        `<div class="row news"><div class="col-lg-4"><img class="news-img-size" src=${
          news.urlToImage ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
        }></div><div class="col-lg-8"><h3>${news.title}</h3><p>${
          news.description == null || news.description == ""
            ? "내용없음"
            : news.description.length > 200
            ? news.description.substring(0, 200) + "..."
            : news.description
        }</p><div>${news.source.name || "No source"} * ${moment(
          news.publishedAt
        ).fromNow()}</div></div></div>`
    )
    .join("");
  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">${errorMessage}</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const paginationRender = () => {
  // totalResult V
  // page V
  // pageSize V
  // groupSize V
  // totalPages
  const totalPages = Math.ceil(totalResults / pageSize);
  // pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  // lastPage
  let lastPage = pageGroup * 5;
  // 마지막 페이지그룹이 그룹사이즈보다 작다면? lastpage = totalpage
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }
  // firstPage
  const firstPage = lastPage - 4 <= 0 ? 1 : lastPage - 4; // => pagination 0부터 시작 x

  let paginationHTML = ``;
  // Previous버튼
  if (firstPage >= 6) {
    paginationHTML = `<li class="page-item" onclick="moveToPage(1)"><a class="page-link" >&lt&lt</a></li>
  <li class="page-item" onclick="moveToPage(${
    page - 1
  })"><a class="page-link" >&lt</a></li>`;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }" onclick="moveToPage(${i})" ><a class="page-link" >${i}</a></li>`;
  }
  // Next버튼
  if (lastPage < totalPages) {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${
      page + 1
    })"><a class="page-link" >&gt</a></li>
    <li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link" >&gt&gt</a></li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  console.log("moveToPage", pageNum);
  page = pageNum;
  fetchNews();
};

fetchNews();
