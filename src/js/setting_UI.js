goog.provide('chr.myApp.settingUI');

goog.require('goog.dom');
goog.require('goog.ui.LabelInput');
goog.require('goog.ui.Button');

goog.require('goog.events');
goog.require('goog.events.EventType');

chr.myApp.settingUI = function(node){
	var self = this;
	var settingDom = goog.dom.createDom('div',{id:'setting'});
	
	var workTimeTextDom = goog.dom.createDom('div',{id:'work-time-text'});
	this._workTimeText = new goog.ui.LabelInput();
	// this._workTimeText.setLabel("25");
	goog.dom.append(workTimeTextDom,'work time');
	this._workTimeText.render(workTimeTextDom);
	
	var breakTimeTextDom = goog.dom.createDom('div', {id:'break-time-text'});
	this._breakTimeText = new goog.ui.LabelInput();
	// this._breakTimeText.setLabel("5");
	goog.dom.append(breakTimeTextDom,'break time');
	this._breakTimeText.render(breakTimeTextDom);
	
	var longTimeTextDom = goog.dom.createDom('div', {id:'long-time-text'});
	this._longTimeText = new goog.ui.LabelInput();
	// this._longTimeText.setLabel("30");
	goog.dom.append(longTimeTextDom,'long break time');
	this._longTimeText.render(longTimeTextDom);
	
	this._workTimeText.setValue("25");
	this._breakTimeText.setValue("5");
	this._longTimeText.setValue("30");
	
	goog.dom.appendChild(node, workTimeTextDom);
	goog.dom.appendChild(node, breakTimeTextDom);
	goog.dom.appendChild(node, longTimeTextDom);
	
	
};

chr.myApp.settingUI.prototype.getWorkTime = function(){
	return this._processInputText(this._workTimeText.getValue());
};

chr.myApp.settingUI.prototype.getBreakTime = function(){
	return this._processInputText(this._breakTimeText.getValue());
};

chr.myApp.settingUI.prototype.getLongBreakTime = function(){
	return this._processInputText(this._longTimeText.getValue());
};

/*
 * check the input text, return true if valid 
 * */
chr.myApp.settingUI.prototype._processInputText = function(text){
	text = text.split(' ').join('');
	var res = text.match("^([0-9]+):([0-9]+)$");
	if(res !== null){
		var hour = parseInt(res[1]);
		var min = parseInt(res[2]);
		if(hour < 24 && hour >= 0 && min<60 && min>=0 ){
			return [hour, min];
		}
	}
	
	res = text.match("^[0-9]+$");
	if(res !== null){
		var minT = parseInt(res);
		if(minT < 1000 && minT > 0){
			var hour = Math.floor(minT/60);
			var min = minT - hour*60;
			return [hour, min];
		}
	}
	
	return null;
};