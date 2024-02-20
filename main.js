const API_KEY = `802b0b4ba9d44b078e2a3d0925cc42cb`;
let news = [];
const getLatestNews = async () => {
  const url = new URL(
    `https://re-times.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`
  );

  const response = await fetch(url);
  const data = await response.json();
  news = data.articles;
  console.log("ddddd", data.articles);
};

getLatestNews();
