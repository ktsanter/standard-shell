"use strict";
//-----------------------------------------------------------------------------------
// standard shell
//-----------------------------------------------------------------------------------
// TODO: add clipboard stuff (make class)
// TODO: add markdown stuff
//-----------------------------------------------------------------------------------

const app = function () {
  const appversion = '0.01';
  const appname = 'Standard shell';
	const page = {};
  const settings = {};
  
  const apiInfo = {
    apibase: 'https://script.google.com/macros/s/AKfycbweqaXGa76eKl_Tuj84UgUyc21K8ty9TE7Je1ffN9D2ZO4CpWxE/exec',
    apikey: 'MV_welcomeAPI'
  };
  
	//---------------------------------------
	// get things going
	//----------------------------------------
  async function init() {
		page.body = document.getElementsByTagName('body')[0];

    _renderStandardElements();
		
    var expectedQueryParams = [{key: 'param1', required: true}, {key: 'param2', required: false}];
    
		if (_initializeSettings(expectedQueryParams)) {
      var data = await _loadInitialData();
      if (data) {
        _renderPage();
      }
		}
  }
  
  async function _loadInitialData() {
    var result = null;
    
    page.notice.setNotice('loading...', true);
    var requestParams = {};
    var requestResult = await googleSheetWebAPI.webAppGet(apiInfo, 'navinfo', requestParams, page.notice);

    if (requestResult.success) {
      page.notice.setNotice('');
      var result = requestResult.data;
      
    } else {
      page.notice.setNotice('load failed');
    }
    
    return result;
  }
  
	//-------------------------------------------------------------------------------------
	// process query params
	//-------------------------------------------------------------------------------------
	function _initializeSettings(expectedParams) {
    var result = false;

    var urlParams = new URLSearchParams(window.location.search);
    for (var i = 0; i < expectedParams.length; i++) {
      var key = expectedParams[i].key;
      settings[key] = urlParams.has(key) ? urlParams.get(key) : null;
    }

    var receivedRequiredParams = true;
    for (var i = 0; i < expectedParams.length && receivedRequiredParams; i++) {
      var key = expectedParams[i].key;
      if (expectedParams[i].required) receivedRequiredParams = (settings[key] != null);
    }
    
    if (receivedRequiredParams) {
			result = true;

    } else {   
      page.notice.setNotice('failed to initialize: invalid parameters');
    }
    
    return result;
  }
	
	//-----------------------------------------------------------------------------
	// page rendering
	//-----------------------------------------------------------------------------  
  function _renderStandardElements() {

    var title = CreateElement._createDiv(null, 'standard-title', appname);
    page.body.appendChild(title);
    
    page.notice = new StandardNotice(page.body, title);
  }

  function _renderPage() {
    page.body.appendChild(CreateElement._createDiv(null, null, '_renderPage'));
  }
  
  
	//------------------------------------------------------------------
	// process MarkDown
	//------------------------------------------------------------------  
  function _convertMarkdownToHTML(text) {
    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();
    var parsed = reader.parse(text);
    var result = writer.render(parsed);

    return result;
  }
 
  //---------------------------------------
  // clipboard functions
  //----------------------------------------
  function _copyToClipboard(txt) {
    if (!page._clipboard) page._clipboard = new ClipboardCopy();

    page._clipboard._copyToClipboard(txt);
	}	

  function _copyRenderedToClipboard(txt) {
    var container, elemButton, elemTarget;
    
    if (!page._renderedclipboardcontainer) {
      container = CreateElement._createDiv('renderedCopyContainer', 'renderedcopy');
      elemButton = CreateElement._createButton('btnCopyRendered', null, 'hide me');
      elemTarget = CreateElement._createDiv('divCopyRenderedTarget', null);
      elemButton.setAttribute('data-clipboard-target', '#' + elemTarget.id);
      var junk = new Clipboard(elemButton); 
      
      container.appendChild(elemButton);
      container.appendChild(elemTarget);
      page._renderedclipboardcontainer = container;
      page.body.appendChild(page._renderedclipboardcontainer);
      
    } else {
      container = document.getElementById('renderedCopyContainer');
      elemButton = document.getElementById('btnCopyRendered');
      elemTarget = document.getElementById('divCopyRenderedTarget');
    }
    
    container.style.display = 'block';
    elemTarget.innerHTML = txt;
    elemButton.click();
    container.style.display = 'none';
  }
   
	//------------------------------------------------------------------
	// handlers
	//------------------------------------------------------------------    
  
	//---------------------------------------
	// return from wrapper function
	//----------------------------------------
	return {
		init: init
 	};
}();
