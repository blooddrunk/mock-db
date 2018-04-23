const categories = [...Array(3).keys()].map(index => ({
  id: index,
  name: `category${index}`,
}));

const authors = [...Array(10).keys()].map(index => ({
  id: index,
  name: `author${index}`,
}));

const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const randDate = start =>
  new Date(start.getTime() + Math.random() * (Date.now() - start.getTime()));

const posts = [...Array(100).keys()].map(index => ({
  id: index,
  title: `title${index}`,
  category: rand(categories).name,
  author: rand(authors).name,
  content: `content${index}`,
  createdAt: randDate(new Date(2010, 0, 1)),
  updatedAt: randDate(new Date(2010, 0, 1)),
}));

module.exports = {
  posts,
};
