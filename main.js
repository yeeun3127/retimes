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
  // array function
  const newsHTML = newsList
    .map(
      (
        news
      ) => `<div class="row news"><div class="col-lg-4"><img class="news-img-size" src=${
        news.urlToImage ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
      }>
                  </div>
                  <div class="col-lg-8">
                  <h3>${news.title}</h3>
                    <p>
                      ${
                        news.description == null || news.description == ""
                          ? "내용없음"
                          : news.description.length > 200
                          ? news.description.substring(0, 200) + "..."
                          : news.description
                      }
                                                </p>
                                                <div>
                                                    ${
                                                      news.source.name ||
                                                      "No source"
                                                    } * ${moment(
        news.publishedAt
      ).fromNow()}
                                                </div>
                                            </div>
                                        </div>`
    )
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
                        ${errorMessage}
                    </div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  const lastPage = pageGroup * groupSize;
  if (lastPage > totalPages) {
    // 마지막 페이지 그룹이 그룹 사이즈보다 작다? lastpage = totalpage
    lastPage = totalPages;
  }
  const firstPage =
    lastPage - (groupSize - 1) < 0 ? 1 : lastPage - (groupSize - 1);

  // first~last : bootstrap!!!
  let paginationHTML = ``;
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }
  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  console.log("moveToPage", pageNum);
  page = pageNum;
  fetchNews();
};

fetchNews();
