const posts = [...Array(100).keys()].map(index => ({
  id: index,
  title: `title${index}`,
  author: `author${index}`,
  content: `content${index}`,
  createdAt: Date.now(),
  updatedAt: Date.now(),
}));

module.exports = {
  posts,
};
