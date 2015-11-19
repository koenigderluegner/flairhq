var ng = require('angular');
var $ = require('jquery');
var marked = require('marked');

var refCtrl = require('./refCtrl');
var indexCtrl = require('./indexCtrl');
var adminCtrl = require('./adminCtrl');
var banCtrl = require('./banCtrl');
var userCtrl = require('./userCtrl');
require('./search/search.module');
require('angular-spinner');
require('angular-md');
require('angular-bootstrap-npm');
require('angular-mask');
require('bootstrap');
require('./ngReallyClick');
require('./common/tooltipModule');
require('./common/genericTooltipModule');
require('./numberPadding');
//require('spin');

var fapp = ng.module("fapp", [
  'angularSpinner',
  'ngReallyClickModule',
  'numberPaddingModule',
  'yaru22.md',
  'tooltipModule',
  'genericTooltipModule',
  'ngMask',
  'fapp.search'
]);

fapp.factory('UserFactory', function () {
  var user;

  return {
    getUser: function () {
      return user;
    },
    setUser: function (newUser) {
      user = newUser;
    }
  };
});

// Define controllers, and their angular dependencies
fapp.controller("referenceCtrl", ['$scope', '$filter', refCtrl]);
fapp.controller("indexCtrl", ['$scope', indexCtrl]);
fapp.controller("userCtrl", ['$scope', '$filter', '$location', 'UserFactory', userCtrl]);
fapp.controller("adminCtrl", ['$scope', adminCtrl]);
fapp.controller("banCtrl", ['$scope', banCtrl]);

// Bug fix for iOS safari
$(function () {
  $("[data-toggle='collapse']").click(function () {
    // For some reason, iOS safari doesn't let collapse work on a div if it
    // doesn't have a click handler. The click handler doesn't need to do anything.
  });
});

window.marked = marked;
ng.bootstrap(document, ['fapp']);