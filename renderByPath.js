const faker = require('faker');
const url = require('url');

faker.locale = 'zh_CN';

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

module.exports = (req, res) => {
  const requestUrl = url.parse(req.url, true);
  const result = res.locals.data;
  switch (requestUrl.pathname) {
    case '/posts':
    case '/gatewayOnline':
    case '/gatewayOnlineLog': {
      return getPagination(res);
    }
    default:
      return result;
  }
};
