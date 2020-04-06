# Digipolis-response

Digipolis-response adds a function to the res object which can be used to automatically
format hal+json. `res.sendResponse` returns a function which is an error-first callback 
function. if an error is passed, it wil be given to the callback function defined in res.sendResponse.


If an array is passed, a third argument is expected: `pagingInformation` (not necessary but highly recommended). The function will take care of formatting it to hal+json.

## Usage

### Callback
#### res.sendResponse(callback, options)
To be used if your function returns the results through a callback.

- callback: the callback to trigger in case of an error. (not triggered on success)
- options: options object
    - url (optional) **string**: the url to use for the links inside the HAL response.
    - multipleEmbeds (optional) **boolean**: if multiple types of entities are embedded inside the response (the result should be returned in the following format `{entityName1: [], entityName2: []}`)
    - collectionName (optional) **string**: the name of the entity you are wrapping

a function is returned which can be used as a callback. This function accepts three arguments:
- err: if an error occurred, it should be passed as the first argument.
- (entity|entities) **object or array**: this will be embedded in the HAL response
- pagingInformation:  information for the paging inside the HAL response
  - number (optional) **string or int**: the currentPage requested
  - size (optional) **int**: number of items inside the response, if not given, the length of the array in entities is used.
  - totalPages **int**: total number of pages available  (e.g totalNumber of entities / size)
 
#### Example 



```
const app = express();
app.use(require('digipolis-response')());

// also possible with router, etc...
app.get('/items', (req, res, next => {
  getItems(res.sendResponse(next, {
    collectionName: 'items', // if not supplied, resourceList will be used as embedded name
    url: '/api/items' // if not supplied, will build an url of req.baseUrl + req.path
    multipleEmbeds: boolean // (default false, when set to true, an object can be passed)
  }))
}));

function getItems(callback) {
  return callback(
    null,
    [...],
    {
      totalPages: 200,
      number: 1 // the current page, not necessary if page is present in queryParams.
    }
  )
}
```

### Promise
To be used when your function returns it's result through a promise.

- options: options object
    - url (optional) **string**: the url to use for the links inside the HAL response.
    - multipleEmbeds (optional) **boolean**: if multiple types of entities are embedded inside the response (the result should be returned in the following format `{entityName1: [], entityName2: []}`)
    - collectionName (optional) **string**: the name of the entity you are wrapping

a function is returned which can be chained to your promise (see example)

This function accepts one argument (an object) containing:
- result: 
  - (entity|entities) **object or array**: this will be embedded in the HAL response
  - pagingInformation:  information for the paging inside the HAL response
    - number (optional) **string or int**: the currentPage requested
    - size (optional) **int**: number of items inside the response, if not given, the length of the array in entities is used.
    - totalPages **int**: total number of pages available  (e.g totalNumber of entities / size)

### res.respond(options)
```
const app = express();
app.use(require('digipolis-response')());

// also possible with router, etc...
app.get('items', (req, res, next => {
  getItems()
    .then(res.respond(options))
    .catch(next)

function getItems() {
  return Promise.resolve({
    pagingInformation : {...},
    entity: {...}
    entities: [{...}]
  };)
}
```
