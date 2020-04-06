'use strict';

const hal = require('hal');
const qs = require('querystring');

function getLink(linkName, baseUrl, page, queryParams) {
  const query = Object.assign({}, queryParams, { page: page });
  return new hal.Link(linkName, `${baseUrl}?${qs.stringify(query)}`);
}

function generateLinks(baseUrl, page, totalPages, queryParams) {
  const links = [
    getLink('first', baseUrl, 1, queryParams),
    getLink('last', baseUrl, totalPages, queryParams)
  ];

  if (page - 1 >= 1) {
    links.push(getLink('prev', baseUrl, page - 1, queryParams));
  }

  if (page + 1 <= totalPages) {
    links.push(getLink('next', baseUrl, page + 1, queryParams));
  }

  return links;
}

function getStartLimitLink(linkName, baseUrl, start, limit, queryParams) {
  const query = Object.assign({}, queryParams, { start: start, limit: limit });
  return new hal.Link(linkName, `${baseUrl}?${qs.stringify(query)}`);
}

function generateStartLimitLinks(baseUrl, start, limit, entitiesSize, queryParams) {
  const links = [
    getStartLimitLink('first', baseUrl, 0, limit, queryParams),
  ];

  if(start > 0 && (start - limit) < 0) {
    links.push(getStartLimitLink('prev', baseUrl, 0, limit - start, queryParams));
  }

  if(start > 0 && start >= limit) { 
    links.push(getStartLimitLink('prev', baseUrl, start - limit, limit, queryParams));

  } 

  if(entitiesSize === limit) {
    links.push(getStartLimitLink('next', baseUrl, start + limit, limit, queryParams));
  }
  return links;
}

function formatHal(collectionName, entities, pagingInformation, baseUrl, queryParams) {
  const currentPage = queryParams.page || pagingInformation.number || 1;
  const collection = new hal.Resource({
    _page: Object.assign({size: pagingInformation.size || entities.length}, pagingInformation)
  }, getLink('self', baseUrl, currentPage, queryParams));
  let links = [];
  
  // because start = 0 evaluates to false
  if(queryParams.start != null && queryParams.limit && Array.isArray(entities)) {
    links = generateStartLimitLinks(baseUrl, queryParams.start, queryParams.limit, entities.length, queryParams);
  } else {
    links = generateLinks(baseUrl, currentPage, pagingInformation.totalPages, queryParams);
  }
  links.forEach(link => collection.link(link));
  if(Array.isArray(entities)) {
    collection.embed(collectionName, entities, false);
  } else {
    Object.keys(entities).forEach(key => collection.embed(key, entities[key], false));
  }
  return collection.toJSON();
}

module.exports = formatHal;
