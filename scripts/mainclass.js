"use strict";

class ktsStandardExample {
  constructor (settings) {
    this._settings = settings;
    
    this._appversion = '0.01';
  }
  
	//-----------------------------------------------------------------------------
	// page rendering
	//-----------------------------------------------------------------------------  
  attachTo(elem) {
    attachTo.appendChild(this.render());
  }
  
  render() {
    var container = CreateElement.createDiv(null, null);
    this._maincontianer = container;
    
    var contents = CreateElement.createDiv(null, 'standard-contents');
    container.appendChild(contents);
    
    contents.appendChild(this._renderParams());
    contents.appendChild(this._renderMarkdownExample());
    contents.appendChild(this._renderCopyToClipboardExample());
    contents.appendChild(this._renderDateTimeExample());
    
    return container;
  }
    
  _renderParams() {
    var container = CreateElement.createDiv(null, 'standard-section');
    
    container.appendChild(CreateElement.createDiv(null, 'standard-section-label', 'query parameters'));
    var s = 'param1=' + this._settings.param1 + '<br>param2=' + this._settings.param2;
    container.appendChild(CreateElement.createDiv(null, 'standard-section-contents', s));
  
    return container;
  }
  
  _renderMarkdownExample() {
    var container = CreateElement.createDiv(null, 'standard-section');
    
    container.appendChild(CreateElement.createDiv(null, 'standard-section-label', 'Markdown example'));
    var contents = CreateElement.createDiv(null, 'standard-section-contents');
    container.appendChild(contents);
    
    var elem = CreateElement.createTextArea('inputMarkdown', null);
    contents.appendChild(elem);
    this._inputMarkdown = elem;
    elem.rows = 5;
    elem.cols = 80;
    elem.placeholder = 'enter Markdown text';
    elem.addEventListener('input', e => this._handleMarkdownInput(e));
        
    contents.appendChild(CreateElement.createBR(null, null));
    
    elem = CreateElement.createDiv('outputMarkdown', null);
    contents.appendChild(elem);
    this._outputMarkdown = elem;    

    return container;
  }  
  
  _renderCopyToClipboardExample() {
    var container = CreateElement.createDiv(null, 'standard-section');
    
    container.appendChild(CreateElement.createDiv(null, 'standard-section-label', 'clipboard copy example'));
    var elem = CreateElement.createDiv(null, 'standard-section-contents');
    container.appendChild(elem);
    
    elem = CreateElement.createTextInput('inputCopy', null)
    container.appendChild(elem);
    this._inputCopy = elem;
    elem.placeholder = 'enter text to copy or render';
    
    container.appendChild(CreateElement.createButton(null, 'standard-button', 'copy', null, e => this._handleCopy1(e)));
    container.appendChild(CreateElement.createButton(null, 'standard-button', 'copy rendered', null, e => this._handleCopy2(e)));
    
    return container;
  }
  
  _renderDateTimeExample() {
    var container = CreateElement.createDiv(null, 'standard-section');
    
    container.appendChild(CreateElement.createDiv(null, 'standard-section-label', 'date/time example'));
    var contents = CreateElement.createDiv(null, 'standard-section-contents');
    container.appendChild(contents);
    
    var dateNow = DateTime.formatDate(Date.now());
    contents.appendChild(CreateElement.createDiv(null, null, 'current date is ' + dateNow));
    
    return container;
  }

  //---------------------------------------
  // clipboard functions
  //----------------------------------------
  _copyToClipboard(txt) {
    if (!this._clipboard) this._clipboard = new ClipboardCopy(this._maincontainer, 'plain');

    this._clipboard.copyToClipboard(txt);
	}	

  _copyRenderedToClipboard(txt) {
    if (!this._renderedclipboard) this._renderedclipboard = new ClipboardCopy(this._maincontainer, 'rendered');

    this._renderedclipboard.copyRenderedToClipboard(txt);
	}	
   
	//------------------------------------------------------------------
	// handlers
	//------------------------------------------------------------------    
  _handleMarkdownInput(e) {
    var md = this._inputMarkdown.value;
    var html = MarkdownToHTML.convert(md);
    this._outputMarkdown.innerHTML = html;
  }
  
  _handleCopy1(e) {
    var str = this._inputCopy.value;
    this._copyToClipboard(str);
  }
  
  _handleCopy2(e) {
    var str = this._inputCopy.value;
    this._copyRenderedToClipboard(MarkdownToHTML.convert(str));
  }
}
