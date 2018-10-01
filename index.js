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
        let result = Array.isArray(entity) || options.multipleEmbeds ? formatHal(options.collectionName || 'items', entity, pagingInformation, baseUrl, req.query) : entity;
        res.set('Content-Type', 'application/hal+json');
        return res.json(result);
      };
    };

    res.respond = (options) => {
      options = options || {};
      return (result) => {
        const pagingInformation = result.pagingInformation || {};
        const entity = result.entity || result.entities;
        const baseUrl = options.url || (req.baseUrl + req.path);

        let hal = Array.isArray(entity) || options.multipleEmbeds ? formatHal(options.collectionName || 'items', entity, pagingInformation, baseUrl, req.query) : entity;
        
        res.set('Content-Type', 'application/hal+json');
        return res.json(hal);
      }
    }

    return next();
  };

};
