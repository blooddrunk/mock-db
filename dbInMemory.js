const faker = require('faker');
faker.locale = 'zh_CN';

const posts = [...Array(50).keys()].map(key => ({
  id: key,
  title: faker.lorem.word(),
  body: faker.lorem.paragraph(),
  company: faker.company.companyName(),
  location: faker.address.streetName(),
}));

module.exports = {
  posts,
};
