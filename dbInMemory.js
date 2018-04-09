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
  deviceMac: faker.internet.mac(),
  activationStatusCode: faker.random.arrayElement([0, 1]),
  activationTime: faker.date.recent(),
  lastLoginTime: faker.date.recent(),
  lastLogoutTime: faker.random.arrayElement([faker.date.recent(), '']),
  onlineCount: faker.random.number(100),
  isOnline: faker.random.arrayElement([0, 1]),
}));

const deviceCount = {
  total: faker.random.number({ min: 200, max: 1000 }),
  active: faker.random.number(200),
  online: faker.random.number(100),
};

const gatewayOnlineLog = [...Array(100).keys()].map(key => ({
  id: key,
  status: faker.random.arrayElement([0, 1]),
  time: faker.date.recent(),
  ip: faker.internet.ip(),
  location: faker.internet.mac(),
}));

module.exports = {
  posts,
  gatewayOnline,
  deviceCount,
  gatewayOnlineLog,
};
