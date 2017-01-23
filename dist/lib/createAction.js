'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeOptions = undefined;

var _lodash = require('lodash.mapvalues');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.merge');

var _lodash4 = _interopRequireDefault(_lodash3);

var _sendRequest = require('./sendRequest');

var _sendRequest2 = _interopRequireDefault(_sendRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reserved = ['onResponse', 'onError'];
var result = function result(fn) {
  for (var _len = arguments.length, arg = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    arg[_key - 1] = arguments[_key];
  }

  return typeof fn === 'function' ? fn.apply(undefined, arg) : fn;
};

// TODO: check entities cache in store and dont fetch if we have it already

/*
 app must have redux-thunk installed
 possible options:

 - onError (optional)(function)
 - onResponse (optional)(function)

 - subset (optional)(string)
 - method (required)(get, post, put, delete, or patch)
 - params (object)
 - endpoint (required)(url string)
 - model (optional)(normalizr model)
 - collection (default false)(boolean)
 - fresh (default to false)(boolean)

 - headers (optional)(object)
 - field (optional)(object)
 - query (optional)(object)
 - body (optional)(object)
 - withCredentials (default false)(boolean)
 - token (optional)(string)
 - locale (optional)(string)
 - auth (optional)(array)


 all options can either be a value, or a function that returns a value.
 if you define a function, it will receive options.params as an argument
 */

var isReserved = function isReserved(k) {
  return reserved.indexOf(k) !== -1;
};
var noop = function noop() {};

/*
 merge our multitude of option objects together
 defaults = options defined in createAction
 opt = options specified in action creator
 state = current state of store
 */
var mergeOptions = exports.mergeOptions = function mergeOptions(defaults, opt, state) {
  return (0, _lodash2.default)((0, _lodash4.default)({}, defaults, opt), function (v, k, _ref) {
    var _ref$params = _ref.params,
        params = _ref$params === undefined ? {} : _ref$params;

    if (isReserved(k)) return v;
    return result(v, params, state);
  });
};

var createAction = function createAction() {
  var defaults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function () {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return function (dispatch, getState) {
      var options = mergeOptions(defaults, opt, getState());

      if (!options.method) throw new Error('Missing method');
      if (!options.endpoint) throw new Error('Missing endpoint');

      var reqPromise = (0, _sendRequest2.default)({ options: options, dispatch: dispatch });
      reqPromise.catch(noop);

      if (options.onResponse) reqPromise.then(options.onResponse, noop);
      if (options.onError) reqPromise.catch(function (err) {
        return options.onError(err, err.response);
      });

      var actionPromise = noop;

      actionPromise.then = function _then(resolve, reject) {
        return reqPromise.then(resolve, reject);
      };

      actionPromise.catch = function _catch(cb) {
        return this.then(undefined, cb);
      };

      return actionPromise;
    };
  };
};

exports.default = createAction;