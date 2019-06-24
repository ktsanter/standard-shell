define(function (require) {
  require('appmain');
  require('mainclass');
  require('standard_notice');
  require('google_webapp_interface');
  require('create_element');
  
  /*-- optional components --*/
  require('markdowntohtml');
  require('clipboard_copy');
  require('date_time');

  document.addEventListener('DOMContentLoaded', app.init());
});