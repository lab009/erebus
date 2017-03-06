'use strict';

exports.__esModule = true;

var _normalizr = require('normalizr');

exports.default = function (body, _ref) {
  var collection = _ref.collection,
      model = _ref.model;
  return (0, _normalizr.normalize)(body, collection ? (0, _normalizr.arrayOf)(model) : model);
};