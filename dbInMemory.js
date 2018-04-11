const faker = require('faker');
faker.locale = 'zh_CN';

const login = {
  account: faker.internet.email(),
  name: faker.name.findName(),
  bandwidth: faker.random.number({ min: 20, max: 200 }),
  currentStrategy: faker.random.number({ min: 0, max: 4 }),
};

const availableStrategyList = [...Array(5).keys()].map(index => ({
  id: index,
  name: `${faker.random.number({ min: 20, max: 200 })}M-${faker.random.number({
    min: 1,
    max: 10,
  })}小时-${faker.random.number({ min: 4, max: 50 })}元`,
  targetBandwidth: faker.random.number({ min: 100, max: 200 }),
  period: faker.random.number({ min: 1, max: 10 }),
  limit: faker.random.number({ min: 0, max: 10 }),
  description: faker.hacker.phrase(),
}));

module.exports = {
  login,
  availableStrategyList,
};
