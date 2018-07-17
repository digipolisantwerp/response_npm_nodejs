'use strict';

const assert = require('assert');
const responseHandler = require('../index');
const reqres = require('reqres');
describe('Test middleware', () => {
  let req;
  let res;

  beforeEach(() => {
    req = reqres.req();
    res = reqres.res();
  });

  it('should add #sendReponse to the res object', () => {
    const handler = responseHandler();
    handler(req, res, () => {
      assert(res.sendResponse);
    })
  });

  it('should be able to partial evaluate res.sendResponse', () => {
    const handler = responseHandler();
    handler(req, res, () => {
      let responseHandler = res.sendResponse(() => { });
      assert(responseHandler);
    });
  });

  it('should be able to give error first to result of res.sendResponse()', () => {
    const handler = responseHandler();
    handler(req, res, () => {
      let send = res.sendResponse((err) => {
        return assert(err);
      }, {});

      send.bind(res)
      send('new Error()');
    });
  });

  it('should be able to send an array as a response, formatted as HAL', () => {
    const handler = responseHandler();
    handler(req, res, () => {
      let send = res.sendResponse(() => { }, { url: '/api/orders' });

      send.bind(res)
      send(null, ['a', 'b', 'c']);
      const json = res.json.args[0][0];
      assert(json._links);
      assert(json._links.self);
      assert(json._links.first);
      assert(json._links.last);
      assert(json._embedded);
      assert(json._embedded.items);
      assert(json._page);
      assert(json._page.size);
    });
  });

  it('should be able to send an array as a response with additional paging info, formatted as HAL', () => {
    const handler = responseHandler();
    handler(req, res, () => {
      let send = res.sendResponse(() => { }, { url: '/api/orders' });

      send.bind(res)
      send(null, ['a', 'b', 'c'], {
        number: 1,
        totalPages: 100
      });
      const json = res.json.args[0][0];
      assert(json._links);
      assert(json._embedded);
      assert(json._embedded.items);
      assert(json._page);
      assert(json._page.size);
    });
  });

  it('should be able get page with query params', () => {
    req = reqres.req({
      params: {
        page: 2,
        pagesize: 20
      }
    });

    const handler = responseHandler();
    handler(req, res, () => {
      let send = res.sendResponse(() => { }, { url: '/api/orders' });

      send.bind(res)
      send(null, ['a', 'b', 'c'], {
        number: 1,
        totalPages: 100
      });
      const json = res.json.args[0][0];
      assert(json._links);
      assert(json._embedded);
      assert(json._embedded.items);
      assert(json._page);
      assert(json._page.size);
    });
  });

  it('should be able to send an objects as a response', () => {
    const handler = responseHandler();
    handler(req, res, () => {
      let send = res.sendResponse(() => { }, { url: '/api/orders' });

      send.bind(res)
      send(null, { h: 'i' });
      const json = res.json.args[0][0];
      assert(json.h, 'i');
    });
  });

  it('should be able to embed multiple collections', () => {
    const multipleCollections = {
      list1: ['test'],
      list2: ['test2']
    };

    const handler = responseHandler();
    handler(req, res, () => {
      let send = res.sendResponse(() => { }, { multipleEmbeds: true });
      send.bind(res);

      send(null, multipleCollections);
      const json = res.json.args[0][0];
      assert(json._embedded.list1, multipleCollections.list1);
      assert(json._embedded.list2, multipleCollections.list2);
    });
  });

  it('should be able to override size', () => {
    const size = 45;
    const handler = responseHandler();
    handler(req, res, () => {
      let send = res.sendResponse(() => { });
      send.bind(res);

      send(null, ['test'], { size: size });
      const json = res.json.args[0][0];
      assert(json._page.size, size);
    });
  });
});
