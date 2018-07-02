const url = require('url');

// const getPagination = (requestUrl, res) => {
//   if (Array.isArray(res.locals.data)) {
//     let { _limit: limit, _page: page } = requestUrl.query;
//     limit = Number.parseInt(limit, 10);
//     page = Number.parseInt(page, 10);
//     const total = Number.parseInt(res.getHeader('X-Total-Count'), 10);
//     const hasMore = total > (page + 1) * limit;
//     return hasMore;
//   }
// };

const getPagination = res => {
  const result = res.locals.data;
  const total = Number.parseInt(res.getHeader('X-Total-Count'), 10);
  return {
    total,
    items: result,
  };
};

const wrapResult = result => ({
  status: 200,
  errorCode: 0,
  result,
});

const render = (req, res) => {
  const requestUrl = url.parse(req.url, true);

  let result;
  switch (requestUrl.pathname) {
    case '/posts':
      result = wrapResult(getPagination(res));
      break;
    default:
      result = wrapResult(res.locals.data);
  }
  res.jsonp(result);
};

module.exports = {
  render,
  routes: {
    '/api/*': '/$1',
  },
  dbPath: './db.js',
};
