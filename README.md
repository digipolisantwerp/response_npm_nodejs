# Digipolis-response

Digipolis-response adds a function to the res object which can be used to automatically
format hal+json. `res.sendResponse` returns a function which is an error-first callback 
function. if an error is passed, it wil be given to the callback function defined in res.sendResponse.

If an array is passed, a third argument is expected: `pagingInformation` (not necessary but highly recommended). The function will take care of formatting it to hal+json.

## Usage

```
const app = express();
app.use(require('digipolis-response')());

// also possible with router, etc...
app.get((req, res, next => {
  getItems(res.sendResponse(next, {
    collectionName: 'items', // if not supplied, items will be used as embedded name
    url: '/api/items' // if not supplied, will build an url of req.baseUrl + req.path
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
