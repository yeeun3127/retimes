const API_KEY = `802b0b4ba9d44b078e2a3d0925cc42cb`;
const url1 = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
const url2 = "https://re-times.netlify.app/top-headlines";
let news = [];
const getLatestNews = async () => {
  const url = new URL(url2);

  const response = await fetch(url);
  const data = await response.json();
  news = data.articles;
  console.log("ddddd", data.articles);
};

getLatestNews();
