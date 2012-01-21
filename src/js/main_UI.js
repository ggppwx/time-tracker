

goog.provide('chr.myApp.mainUI');


goog.require('chr.myApp.timerUI');
goog.require('chr.myApp.buttonsUI');
goog.require('chr.myApp.settingUI');
goog.require('chr.myApp.taskUI');

var DEFAULT_SETTING = {
		'workTime': [0,25],
		'breakTime': [0,5],
		'longBreakTime':[0,30]
};



chr.myApp.mainUI= function(node){
	var self = this;
	//TODO init sound manager
	soundManager.allowScriptAccess = 'always';
	soundManager.flashVersion = 9;
	soundManager.preferFlash = true; // for visualization effects
	soundManager.useHighPerformance = true; // keep flash on screen, boost performance
	soundManager.wmode = 'transparent'; // transparent SWF, if possible
	soundManager.useFastPolling = true; // increased JS callback frequency
	soundManager.url = 'swf/';
	
	// read config file 
	// Put the object into storage
	if(localStorage["setting"] === undefined){
		alert("first run");
		localStorage.setItem('setting', JSON.stringify(DEFAULT_SETTING));
	}
	// Retrieve the object from storage
	var mySetting = JSON.parse(localStorage.getItem('setting'));

	//TODO read database. 
	this._taskBarDom = goog.dom.createDom('div',{id:'task-bar'});
	this._taskUI = new chr.myApp.taskUI(this._taskBarDom);
	goog.dom.appendChild(node,this._taskBarDom);
	
	
	this._timerBarDom = goog.dom.createDom('div',{id:'timer-bar'});
	this._timerUI = new chr.myApp.timerUI(this._timerBarDom, mySetting );
	goog.dom.appendChild(node, this._timerBarDom);
	
	//this._btnBarDom = goog.dom.createDom('div',{id:'btn-bar'});
	//this._btnUI = new chr.myApp.buttonsUI(this._btnBarDom);
	//goog.dom.appendChild(node, this._btnBarDom);
	
	this._settingBarDom = goog.dom.createDom('div', {id:'setting-bar'});
	this._settingUI = new chr.myApp.settingUI(this._settingBarDom);
	goog.dom.appendChild(node, this._settingBarDom);
	
	
	var settingBtnDom = goog.dom.createDom('div',{id:'setting-btn'});
	this._setBtn = new goog.ui.Button('set');
	this._setBtn.render(settingBtnDom);
	goog.dom.appendChild(node, settingBtnDom);
	
	var handleSetBtn = function(e){
		// set the button.
		goog.dom.removeChildren(self._timerBarDom);
		var workTime = self._settingUI.getWorkTime();
		var breakTime = self._settingUI.getBreakTime();
		var longBreakTime = self._settingUI.getLongBreakTime();
		if(workTime !== null && breakTime !== null && longBreakTime != null){
			var setting ={
					'workTime':workTime,
					'breakTime': breakTime,
					'longBreakTime':longBreakTime
			};
			localStorage["setting"] = JSON.stringify(setting);
			self._timerUI = new chr.myApp.timerUI(self._timerBarDom, setting);
		}
	};
	goog.events.listen(this._setBtn, goog.ui.Component.EventType.ACTION, handleSetBtn);
	
	// listen to task bar 
	goog.events.listen(this._taskUI, 'TASK_EVENT',
		    this._handleTaskSel, false, this);
	goog.events.listen(this._timerUI, 'TIME_OVER_EVENT',
		    this._handleTimerOver, false, this);
	
};

/*
 * handle the setting of task 
 * */
chr.myApp.mainUI.prototype._handleTaskSel = function(e){
	//TODO received task change, set task of the timer
	//alert('handletask');
	//alert(e.name);
	var id = e.id;
	var name = e.name;
	var eTime = e.eTime;
	var priority = e.priority;
	var task = {
			'id': id,
			'priority': priority,
			'name':name,
			'eTime':eTime
	};
	this._timerUI.setTask(task);
};

/*
 * handle the event of time over 
 * */
chr.myApp.mainUI.prototype._handleTimerOver = function(e){
	//TODO once the time is over, update the task info
	var id = e.id;
	var name = e.name;
	var eTime = e.eTime;
	var priority = e.priority;
	alert('elapsed time'+eTime.h+'-'+eTime.m+'-'+eTime.s);
	var task = {
			'id': id,
			'priority': priority,
			'name':name,
			'eTime':eTime
	};
	
	this._taskUI.setTask(id, task);
	
};
