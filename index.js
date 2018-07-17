'use strict';
const formatHal = require('./lib/formatHal');
module.exports = function responseHandler() {
  return (req, res, next) => {

    res.sendResponse = function sendResponse(callback, options) {
      options = options || {};

      return (err, entity, pagingInformation) => {
        if (err) {
          return callback(err);
        }

        pagingInformation = pagingInformation || {};
        const baseUrl = options.url || (req.baseUrl + req.path);
        let result = Array.isArray(entity) || options.multipleEmbeds ? formatHal(options.collectionName || 'items', entity, pagingInformation, baseUrl, req.params) : entity;
        res.set('Content-Type', 'application/hal+json');
        return res.json(result);
      };
    };

    return next();
  };
};
