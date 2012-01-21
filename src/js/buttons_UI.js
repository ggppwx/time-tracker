goog.provide('chr.myApp.buttonsUI');

goog.require('goog.events');
goog.require('goog.events.EventType');


goog.require('goog.dom');
goog.require('goog.ui.Button');


chr.myApp.buttonsUI = function(node){
	var workBtnDom = goog.dom.createDom('div',{id:'work-btn'});
	
	this._workBtn = new goog.ui.Button('work');
	this._workBtn.render(workBtnDom);
	this._pauseBtn = new goog.ui.Button('pause');
	this._pauseBtn.render(workBtnDom);
	this._breakBtn = new goog.ui.Button('break');
	this._breakBtn.render(workBtnDom);
	this._longBreakBtn = new goog.ui.Button('long break');
	this._longBreakBtn.render(workBtnDom);
	
	goog.dom.appendChild(node, workBtnDom);
	
	
	
	
	
	// button handlers
	var handleWorkBtn = function(e){
		
	};
	
	var handlePauseBtn = function(e){
		
	};
	
	var handleBreakBtn = function(e){
		
	};
	
	goog.events.listen(this._workBtn, goog.ui.Component.EventType.ACTION,
		      handleWorkBtn);
	goog.events.listen(this._pauseBtn, goog.ui.Component.EventType.ACTION,
		      handlePauseBtn);
	goog.events.listen(this._breakBtn, goog.ui.Component.EventType.ACTION,
		      handleBreakBtn);
	goog.events.listen(this._longBreakBtn, goog.ui.Component.EventType.ACTION,
		      handleLongBreakBtn);
};