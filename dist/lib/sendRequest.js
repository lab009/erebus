'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('C:\\cygwin64\\home\\o.orlov\\projects\\erebus\\node_modules\\babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _entify = require('./entify');

var _entify2 = _interopRequireDefault(_entify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prepareOptions = function prepareOptions(_ref) {
  var req = _ref.req,
      options = _ref.options;

  if (options.headers) {
    req.set(options.headers);
  }
  if (options.field) {
    req.field(options.field);
  }
  if (options.query) {
    req.query(options.query);
  }
  if (options.body) {
    req.send(options.body);
  }
  if (options.withCredentials) {
    req.withCredentials();
  }
  if (options.token) {
    req.set({ Authorization: 'Bearer ' + options.token });
  }
  if (options.locale) {
    req.set({ 'Accept-Language': options.locale });
  }
  if (options.auth) {
    req.auth.apply(req, (0, _toConsumableArray3.default)(options.auth));
  }
};

var checkResponce = function checkResponce(_ref2) {
  var res = _ref2.res,
      options = _ref2.options;

  var debug = options.method.toUpperCase() + ' ' + options.endpoint;

  if (!res) {
    throw new Error('Connection failed: ' + debug);
  }
  if (!res.noContent && res.type !== 'application/json') {
    throw new Error('Unknown response type: \'' + res.type + '\' from ' + debug);
  }
};

var sendRequest = function sendRequest(_ref3) {
  var options = _ref3.options,
      dispatch = _ref3.dispatch;

  dispatch({
    type: 'erebus.request',
    payload: options
  });

  var req = _superagent2.default[options.method.toLowerCase()](options.endpoint);
  prepareOptions({ req: req, options: options });

  return req.then(function (res) {
    checkResponce({ res: res, options: options });
    return res;
  }).then(function (res) {
    dispatch({
      type: 'erebus.success',
      meta: options,
      payload: {
        raw: res.body,
        normalized: options.model && (0, _entify2.default)(res.body, options)
      }
    });
    return res;
  }).catch(function (err) {
    dispatch({
      type: 'erebus.failure',
      meta: options,
      payload: err
    });
    throw err;
  });
};

exports.default = sendRequest;
module.exports = exports['default'];