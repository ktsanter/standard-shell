define(function (require) {
  require('main');
  require('standard_notice');
  require('google_webapp_interface');
  require('create_element');
  
  /*-- optional components --*/
  require('clipboard_copy');

  document.addEventListener('DOMContentLoaded', app.init());
});