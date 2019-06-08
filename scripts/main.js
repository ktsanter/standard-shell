"use strict";
//-----------------------------------------------------------------------------------
// standard shell, includes: 
//  - Google web app API
//  - Markdown conversionwith
//  - clipboard copy
//-----------------------------------------------------------------------------------
// TODO: 
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
        page.body.appendChild(_renderPage());
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
    var title = CreateElement.createDiv(null, 'standard-title', appname);
    page.body.appendChild(title);
    
    page.notice = new StandardNotice(page.body, title);
  }

  function _renderPage() {
    var container = CreateElement.createDiv(null, 'standard-contents');
    
    container.appendChild(_renderParams());
    container.appendChild(_renderMarkdownExample());
    container.appendChild(_renderCopyToClipboardExample());
    
    return container;
  }
    
  function _renderParams() {
    var container = CreateElement.createDiv(null, 'standard-section');
    
    container.appendChild(CreateElement.createDiv(null, 'standard-section-label', 'query parameters'));
    var s = 'param1=' + settings.param1 + '<br>param2=' + settings.param2;
    container.appendChild(CreateElement.createDiv(null, 'standard-section-contents', s));
  
    return container;
  }
  
  function _renderMarkdownExample() {
    var container = CreateElement.createDiv(null, 'standard-section');
    
    container.appendChild(CreateElement.createDiv(null, 'standard-section-label', 'Markdown example'));
    var contents = CreateElement.createDiv(null, 'standard-section-contents');
    container.appendChild(contents);
    
    var elem = CreateElement.createTextArea('inputMarkdown', null);
    contents.appendChild(elem);
    elem.rows = 5;
    elem.cols = 80;
    elem.placeholder = 'enter Markdown text';
    elem.addEventListener('input', _handleMarkdownInput);    
        
    contents.appendChild(CreateElement.createBR(null, null));
    
    elem = CreateElement.createDiv('outputMarkdown', null);
    contents.appendChild(elem);
    

    return container;
  }  
  
  function _renderCopyToClipboardExample() {
    var container = CreateElement.createDiv(null, 'standard-section');
    
    container.appendChild(CreateElement.createDiv(null, 'standard-section-label', 'clipboard copy example'));
    var elem = CreateElement.createDiv(null, 'standard-section-contents');
    container.appendChild(elem);
    
    elem = CreateElement.createTextInput('inputCopy', null)
    container.appendChild(elem);
    elem.placeholder = 'enter text to copy or render';
    
    container.appendChild(CreateElement.createButton(null, 'standard-button', 'copy', null, e => _handleCopy1(e)));
    container.appendChild(CreateElement.createButton(null, 'standard-button', 'copy rendered', null, e => _handleCopy2(e)));
    
    return container;
  }

  //---------------------------------------
  // clipboard functions
  //----------------------------------------
  function _copyToClipboard(txt) {
    if (!page._clipboard) page._clipboard = new ClipboardCopy(page.body, 'plain');

    page._clipboard.copyToClipboard(txt);
	}	

  function _copyRenderedToClipboard(txt) {
    if (!page._renderedclipboard) page._renderedclipboard = new ClipboardCopy(page.body, 'rendered');

    page._clipboard.copyRenderedToClipboard(txt);
	}	
   
	//------------------------------------------------------------------
	// handlers
	//------------------------------------------------------------------    
  function _handleMarkdownInput(e) {
    var md = document.getElementById('inputMarkdown').value;
    var html = MarkdownToHTML.convert(md);
    document.getElementById('outputMarkdown').innerHTML = html;
  }
  
  function _handleCopy1(e) {
    var str = document.getElementById('inputCopy').value;
    _copyToClipboard(str);
  }
  
  function _handleCopy2(e) {
    var str = document.getElementById('inputCopy').value;
    _copyRenderedToClipboard(MarkdownToHTML.convert(str));
  }
  
	//---------------------------------------
	// return from wrapper function
	//----------------------------------------
	return {
		init: init
 	};
}();
