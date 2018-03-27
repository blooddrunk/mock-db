const faker = require('faker');
faker.locale = 'zh_CN';

const posts = [...Array(50).keys()].map(key => ({
  id: key,
  title: faker.lorem.word(),
  body: faker.lorem.paragraph(),
  company: faker.company.companyName(),
  location: faker.address.streetName(),
}));

const gatewayOnline = [...Array(100).keys()].map(key => ({
  id: key,
  mac: faker.internet.mac(),
  status: faker.random.arrayElement([0, 1]),
  activationTime: faker.date.recent(),
  lastOnlineTime: faker.date.recent(),
  lastOfflineTime: faker.random.arrayElement([faker.date.recent(), '']),
  onlineCount: faker.random.number(100),
  onlineStatus: faker.random.arrayElement([0, 1]),
}));

module.exports = {
  posts,
  gatewayOnline,
};
