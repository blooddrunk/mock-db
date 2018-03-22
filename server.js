const jsonServer = require('json-server');
// const path = require('path')
const db = require('./dbInMemory');
const renderByPath = require('./renderByPath');

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
server.use(middlewares);

server.use(
  jsonServer.rewriter({
    '/api/*': '/$1',
  })
);

// const router = jsonServer.router(path.join(__dirname, 'db.js'))
const router = jsonServer.router(db);
router.render = (req, res) => {
  const result = renderByPath(req, res);
  res.jsonp({
    errorCode: 0,
    errorMsg: null,
    result,
  });
};

server.use(router);
server.listen(3001, () => {
  console.log('JSON Server is running at port 3001');
});
