const posts = [...Array(100).keys()].map(index => ({
  id: index,
  title: `title${index}`,
  author: `author${index}`,
  content: `content${index}`,
}));

module.exports = {
  posts,
};
