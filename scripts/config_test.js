class ktsConfig_Test {
  constructor (callback) {
    this._callback = callback;
    
    this._cssFiles = {
      localbase: 'styles',
      localfiles: ['appmain.css', 'standard_notice.css', 'clipboard_copy.css'],
      otherfiles: [
        {
          href: 'https://use.fontawesome.com/releases/v5.8.2/css/all.css', 
          integrity: 'sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay', 
          crossorigin: 'anonymous'
        }
      ]
    }

    this._jsFiles = {
      requireBase: 'scripts',
      require: ['mainclass', 'standard_notice', 'google_webapp_interface', 'create_element', 'markdowntohtml', 'clipboard_copy', 'date_time'],
      other: ['commonmark_min.js', 'clipboard.min.js']
    };
    
    this._initialize(this._cssFiles, this._jsFiles);
  }
  
//-----------------------------------------------------------------
// driver functions
//-----------------------------------------------------------------

  async _initialize(cssFilesToLoad, jsFilesToLoad) {
    await this._loadFiles(cssFilesToLoad, jsFilesToLoad);
    this._lastToLoad(this._callback);
  }
  
//-----------------------------------------------------------------
// load functions
//-----------------------------------------------------------------
  async _loadFiles(cssFiles, jsFiles) {
    var attachTo = document.getElementsByTagName("head")[0];
    await this._loadCSSFiles(cssFiles, attachTo);
    await this._loadJSFiles(jsFiles, attachTo);
  }
  
  async _loadCSSFiles(config, attachTo) {
    for (var i = 0; i < config.localfiles.length; i++) {
      var href = config.localbase + '/' + config.localfiles[i];
      var elem = document.createElement('link');
      attachTo.appendChild(elem);
      elem.href = href;
      elem.rel = 'stylesheet';
      elem.type = 'text/css'; 
    }          
  }
  
  async _loadJSFiles(config, attachTo) {
    var scriptBase = config.requireBase;
    var arrFileNames = config.require;

    for (var i = 0; i < arrFileNames.length; i++) {
      attachTo.appendChild(this._createScriptElement(scriptBase + '/' + arrFileNames[i] + '.js'));
    }
    
    arrFileNames = config.other;
    for (var i = 0; i < arrFileNames.length; i++) {
      attachTo.appendChild(this._createScriptElement(scriptBase + '/' + arrFileNames[i]));
    }
  }

  _lastToLoad(callback) {
    var elem = document.createElement('script');
    elem.async = false;
    elem.src = 'scripts/last_to_load.js'
    elem.addEventListener('load', function() {
      callback(); 
    }, false);
    
    document.getElementsByTagName("head")[0].appendChild(elem);
  }
  
  _createScriptElement(src) {
    var elem = document.createElement('script');
    elem.src = src;
    elem.async = false;
    return elem;
  }    
}