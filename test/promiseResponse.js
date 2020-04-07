const assert = require('assert');
const responseHandler = require('..');
const reqres = require('reqres');

describe('Test middleware and response on Promise resolved', () => {
  let req;
  let res;

  beforeEach(() => {
    req = reqres.req();
    res = reqres.res();
  });

  it('should add #sendReponse to the res object', () => {
    const handler = responseHandler();
    handler(req, res, () => {
      assert(res.respond);
      // checks if it returns a function
      assert(res.respond());
    });
  });

  it('should send Promise result', () => {
    const handler = responseHandler();

    function getResults() {
      return Promise.resolve({
        entities: [{
          test: 1
        }, {
          test: 'two'
        }, {
          test: 'three'
        }]
      });
    }
    handler(req, res, () => {
      const respond = res.respond();
      respond.bind(res);
      getResults()
        .then(respond)
        .then(() => {
          const json = res.json.args[0][0];
          assert(json._links);
          assert(json._embedded);
          assert(json._embedded.resourceList);
          assert(json._page);
          assert(json._page.size);
        });
    });
  });
})