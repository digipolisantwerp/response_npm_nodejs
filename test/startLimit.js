'use strict';

const assert = require('assert');
const responseHandler = require('..');
const reqres = require('reqres');

function getResults(numberOfItems) {
  let entities = [];
  for (let i = 0; i < numberOfItems; i++) {
    entities.push({
      hello: 'world'
    });
  }
  return Promise.resolve({
    entities
  });
}

describe('Test links with start & limit', (done) => {
  const baseReq = {
    baseUrl: 'https://google.com',
    path: '/hello'
  }

  it('start, 0, limit 10', (done) => {
    const start = 0;
    const limit = 10;
    const req = reqres.req(
      Object.assign({}, baseReq, {
        query: {
          start,
          limit
        }
      })
    );

    const res = reqres.res();
    const handler = responseHandler();

    handler(req, res, () => {
      const respond = res.respond();
      respond.bind(res);
      getResults(10)
        .then(respond)
        .then(() => {
          const links = res.json.args[0][0]._links;
          assert(links.first.href.includes(`start=0`));
          assert(links.self.href.includes(`limit=${limit}`));
          assert(links.self.href.includes(`start=${start}`));
          assert(links.self.href.includes(`limit=${limit}`));
          assert(links.next.href.includes(`start=${start + limit}`));
          assert(links.next.href.includes(`limit=${limit}`));
          return done();
        });
    });
  });

  it('start, 3, limit 10', (done) => {    
    const start = 3;
    const limit = 10;

    const req = reqres.req(
      Object.assign({}, baseReq, {
        query: {
          start,
          limit
        }
      })
    );

    const res = reqres.res();
    const handler = responseHandler();
    handler(req, res, () => {
      const respond = res.respond();
      respond.bind(res);
      getResults(10)
        .then(respond)
        .then(() => {
          const links = res.json.args[0][0]._links;
          assert(links.first.href.includes(`start=0`));
          assert(links.self.href.includes(`limit=${limit}`));
          assert(links.self.href.includes(`start=${start}`));
          assert(links.self.href.includes(`limit=${limit}`));
          assert(links.next.href.includes(`start=${start + limit}`));
          assert(links.next.href.includes(`limit=${limit}`));

          assert(links.prev.href.includes(`start=${0}`));
          assert(links.prev.href.includes(`limit=${limit - start}`));
          return done();
        });
    });
  })
});
