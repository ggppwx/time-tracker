goog.provide('chr.myApp.timerUI');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventType');

goog.require('goog.ui.Button');
goog.require('goog.ui.FlatButtonRenderer');


chr.myApp.timerUI = function(node,setting){
	goog.base(this);
	var self = this;
	
	this.initSound();
	this._tickSound = true; 	//init tick sound, in default is true
	
	//TODO task information. 
	this._currTask = null;
	
	this._workCount = 0;
	this._longBreakInter = setting.longBreakInter;
	
	this._today = new Date();
	this._inID;
	this._boardTime = new Date();  // count down 
	this._taskTime = new Date();  // count up 
	
	this._workTime = setting.workTime;
	this._breakTime = setting.breakTime;
	this._longBreakTime = setting.longBreakTime;
	

	
	// time board status
	this._isWorking = false;
	this._isPaused = false;
	this._isBreaking = false;
	
	this._taskStatusDom = goog.dom.createDom('div',{id:'task-status'});
	//goog.dom.appendChild(node, this._taskStatusDom);
	//task-status has 
	
	this._timerStatusDom = goog.dom.createDom('div',{id:'timer-status','class':'textCenter'});
	var status = 'work time: '+this._workTime[0]+'h'+this._workTime[1]
		+'m -------- break time: '+this._breakTime[0]+'h'+this._breakTime[1]
		+'m -------- long break time: '+this._longBreakTime[0]+'h'+this._longBreakTime[1]+'m';
	goog.dom.setTextContent(this._timerStatusDom,status);
	goog.dom.appendChild(node,this._timerStatusDom);
	
	this._timerBoardDom = goog.dom.createDom('div',{id:'timer-board'});
	goog.dom.setTextContent(this._timerBoardDom, "0:0:0");
	goog.dom.classes.add(this._timerBoardDom,"time");
	goog.dom.classes.add(this._timerBoardDom,"clear");
	goog.dom.appendChild(node,this._timerBoardDom);
	
	
	// buttons
	var toolBarDom = goog.dom.createDom('div'); 
	var workBtnDom = goog.dom.createDom('div',{id:'button-bar'});	
	this._workBtn = new goog.ui.Button('work');
	this._workBtn.render(workBtnDom);
	this._pauseBtn = new goog.ui.Button('pause');
	this._pauseBtn.setEnabled(false);
	this._pauseBtn.render(workBtnDom);
	this._breakBtn = new goog.ui.Button('break');
	this._breakBtn.render(workBtnDom);
	this._longBreakBtn = new goog.ui.Button('long break');
	this._longBreakBtn.setEnabled(false);
	this._longBreakBtn.render(workBtnDom);
	this._stopBtn = new goog.ui.Button('stop');
	this._stopBtn.setEnabled(true);
	this._stopBtn.render(workBtnDom);
	
	goog.dom.classes.add(this._workBtn.getElement(),"signUp","margin5");
	goog.dom.classes.add(this._pauseBtn.getElement(),"signUp","margin5");
	goog.dom.classes.add(this._breakBtn.getElement(),"signUp","margin5");
	goog.dom.classes.add(this._longBreakBtn.getElement(),"signUp","margin5");
	goog.dom.classes.add(this._stopBtn.getElement(),"mini_signUp_orange","margin5");
	
	goog.dom.classes.add(workBtnDom,"clear");
	goog.dom.classes.add(workBtnDom,"blockCenter");
	goog.dom.appendChild(toolBarDom, workBtnDom);
	goog.dom.classes.add(toolBarDom,"buttons");
	goog.dom.appendChild(node, toolBarDom);
	goog.dom.appendChild(node, this._taskStatusDom);
	

	// button handlers
	var handleWorkBtn = function(e){
		var selfRef = self;
		if(selfRef._currTask === null){
			alert('no task specified');
			return;
		}
		if(!selfRef._isWorking){
			selfRef._isWorking = true;
			selfRef._workBtn.setEnabled(false);
			selfRef._pauseBtn.setEnabled(true);
			selfRef._breakBtn.setEnabled(false);
			selfRef._longBreakBtn.setEnabled(false);
			selfRef._pauseBtn.setContent('pause');
			selfRef._workBtn.setContent('work');
			
			//set time
			var hour = selfRef._workTime[0];
			var min = selfRef._workTime[1];
			// start playing tick
			if(selfRef._tickSound){
				// playing tick.
				selfRef.playTickSound();
			}
			selfRef._startCountDown(hour,min,0);
			
		}
		//soundManager.stopAll();
	};
	
	var handlePauseBtn = function(e){
		var selfRef = self;
		if(selfRef._currTask === null){
			alert('no task specified');
			return;
		}
		if(selfRef._isWorking){
			selfRef._pauseCountDown();
			selfRef._isWorking = false;
			selfRef._isPaused = true;
			// change the button text to resume. 
			selfRef._pauseBtn.setContent('resume');
			selfRef._workBtn.setContent('restart');
			selfRef._workBtn.setEnabled(true);
			//stop playing all sound 
			selfRef.stopAllSound();
		}else{
			// if not working 
			if(selfRef._isPaused){
				// resume the count down
				selfRef._resumeCountDown();
				selfRef._isPaused = false;
				selfRef._isWorking = true;
				selfRef._pauseBtn.setContent('pause');
				selfRef._workBtn.setContent('work');
				selfRef._workBtn.setEnabled(false);
				//start to play tick sound 
				if(selfRef._tickSound){
					selfRef.playTickSound();	
				}
				
			}
		}
		//soundManager.stopAll();
		
	};
	
	var handleBreakBtn = function(e){
		var selfRef = self;
		if(selfRef._currTask === null){
			alert('no task specified');
			return;
		}
		if(!selfRef._isWorking && !selfRef._isBreaking && !selfRef._isPaused){
			selfRef._isBreaking = true;
			selfRef._workBtn.setEnabled(false);
			selfRef._pauseBtn.setEnabled(false);
			selfRef._breakBtn.setEnabled(false);
			var hour = selfRef._breakTime[0];
			var min = selfRef._breakTime[1];
			selfRef._startCountDown(hour,min,0);
			
		}else{
			//TODO not working 
		}
		soundManager.stopAll();
	};
	
	var handleLongBreakBtn = function(e){
		var selfRef = self;
		if(selfRef._currTask === null){
			alert('no task specified');
			return;
		}
		if(!selfRef._isWorking && !selfRef._isBreaking && !selfRef._isPaused){
			selfRef._workCount = 0;
			selfRef._isBreaking = true;
			selfRef._workBtn.setEnabled(false);
			selfRef._pauseBtn.setEnabled(false);
			selfRef._breakBtn.setEnabled(false);
			selfRef._longBreakBtn.setEnabled(false);
			
			var hour = selfRef._longBreakTime[0];
			var min = selfRef._longBreakTime[1];
			selfRef._startCountDown(hour,min,0);
		}else{
			//TODO not working 
			
			
		}
		soundManager.stopAll();
	};
	
	var handleStopBtn = function(e){
		var selfRef = self;
		if(selfRef._currTask === null){
			alert('no task specified');
			return;
		}
		selfRef._pauseBtn.setContent('pause');
		selfRef._workBtn.setContent('work');	
		selfRef._reset();
		selfRef._isWorking = false;
		selfRef._isPaused = false;
		selfRef._isBreaking = false;
		soundManager.stopAll();
	};
	
	
	// listener, listen to the button event 
	goog.events.listen(this._workBtn, goog.ui.Component.EventType.ACTION,
		      handleWorkBtn);
	goog.events.listen(this._pauseBtn, goog.ui.Component.EventType.ACTION,
		      handlePauseBtn);
	goog.events.listen(this._breakBtn, goog.ui.Component.EventType.ACTION,
		      handleBreakBtn);
	goog.events.listen(this._longBreakBtn, goog.ui.Component.EventType.ACTION,
		      handleLongBreakBtn);	
	goog.events.listen(this._stopBtn, goog.ui.Component.EventType.ACTION,
		      handleStopBtn);	
	
	// listen to task events 
	
	
};
goog.inherits(chr.myApp.timerUI, goog.events.EventTarget);



chr.myApp.timerUI.prototype._startCount = function(){
	var selfRef = this;
	clearInterval(selfRef._inID);
	var timeCount = function(){
		selfRef._today = new Date();
		selfRef._today.setMinutes(10);
		var h = selfRef._today.getHours();
		var m = selfRef._today.getMinutes();
		
		var s = selfRef._today.getSeconds();
		m = selfRef._checkTime(m);
		s = selfRef._checkTime(s);
		var timerStates = h+':'+m+':'+s;
		goog.dom.setTextContent(selfRef._timerBoardDom, timerStates);
		//t=setTimeout("timeCount()",1000);
	};
	selfRef._inID = setInterval(function(){timeCount();},1000);
};

/*
 * start count down from a given time. 
 * 
 * */
chr.myApp.timerUI.prototype._startCountDown = function(hour,min,sec){
	var selfRef = this;
	clearInterval(selfRef._inID);
	// starts from the board time 
	selfRef._boardTime = new Date();  
	selfRef._boardTime.setHours(hour, min, sec);
	
	//set the initial task, get from task info.
	if(!selfRef._isPaused){ //if not paused
		selfRef._taskTime = new Date();
		var h = selfRef._currTask.eTime.h;
		var m = selfRef._currTask.eTime.m;
		var s = selfRef._currTask.eTime.s;
		selfRef._taskTime.setHours(h, m, s);
	}
	
	var countSec = -1;
	
	var timeCount = function(){
		//convert boardTime to board time 
		var h = selfRef._boardTime.getHours();
		var m = selfRef._boardTime.getMinutes();
		var s = selfRef._boardTime.getSeconds();
		
		if( h === 0 && m === 0 && s === 0){
			// end of the loop 
			selfRef._finishCountDown();
			return;
		}
		
		m = selfRef._checkTime(m);
		s = selfRef._checkTime(s);
		
		//show time left on board 
		var timerStates = h+':'+m+':'+s;
		goog.dom.setTextContent(selfRef._timerBoardDom, timerStates);
		goog.dom.setTextContent(selfRef._taskStatusDom, 
				selfRef._currTask.name+'--'+selfRef._taskTime.getHours()+':'+selfRef._taskTime.getMinutes()+':'+selfRef._taskTime.getSeconds());
		//t=setTimeout("timeCount()",1000);
		// minus 1 in each loop
		selfRef._boardTime.setTime(selfRef._boardTime.getTime() - 1*1000);
		//TODO add task time
		selfRef._taskTime.setTime(selfRef._taskTime.getTime() + 1*1000);
		
		countSec--;
	};
	selfRef._inID = setInterval(function(){timeCount();},1000);
};

chr.myApp.timerUI.prototype._checkTime = function(i){
	if( i< 10 ){
		i = "0" + i;
	}
	return i;
};

/*
 * start count down 
 * */
chr.myApp.timerUI.prototype._pauseCountDown = function(){
	var selfRef = this;
	clearInterval(selfRef._inID);
};

/*
 * resume count down 
 * */
chr.myApp.timerUI.prototype._resumeCountDown = function(){
	var selfRef = this;
	// clearInterval(selfRef._inID);
	var h = selfRef._boardTime.getHours();
	var m = selfRef._boardTime.getMinutes();
	var s = selfRef._boardTime.getSeconds();
	selfRef._startCountDown(h, m, s);
};

/*
 * reset the time board.
 * invoked by stop button
 * */
chr.myApp.timerUI.prototype._reset = function(){
	var selfRef = this;
	clearInterval(selfRef._inID);
	goog.dom.setTextContent(selfRef._timerBoardDom, "0:0:0");
	selfRef._boardTime = new Date();
	
	//  BUGS solved here.   
	if(selfRef._isWorking || selfRef._isPaused){  	
		selfRef._isWorking = false;
		selfRef._isPaused = false;
		
		// change the elapsed time and send task to mainUI 
		selfRef._currTask.eTime.h = selfRef._taskTime.getHours();
		selfRef._currTask.eTime.m = selfRef._taskTime.getMinutes();
		selfRef._currTask.eTime.s = selfRef._taskTime.getSeconds();
		// send event 
		var event = {
				type:'TIME_OVER_EVENT',
				'id':selfRef._currTask.id,
				'name':selfRef._currTask.name,
				'eTime':selfRef._currTask.eTime,
				'priority':selfRef._currTask.priority
		};
		selfRef.dispatchEvent(event);
	}
	this._workBtn.setEnabled(true);
	this._pauseBtn.setEnabled(false);
	this._breakBtn.setEnabled(true);
	this._longBreakBtn.setEnabled(false);

};

/*
 * invoked after the count down reaches 0
 * */
chr.myApp.timerUI.prototype._finishCountDown = function(){
	var selfRef = this;
	clearInterval(selfRef._inID);
	
	if(selfRef._isWorking){
		// finish work
		selfRef._workCount++;
		var status = 'time to break';
		goog.dom.setTextContent(selfRef._timerBoardDom, status);
		selfRef._isWorking = false;
		//disable pause button
		selfRef._pauseBtn.setEnabled(false);
		// enable break button 
		selfRef._breakBtn.setEnabled(true);
		if(selfRef._workCount >= selfRef._longBreakInter){
			selfRef._longBreakBtn.setEnabled(true);
		}
		selfRef._workBtn.setEnabled(true);
		
		// change the task elapse time 
		selfRef._currTask.eTime.h = selfRef._taskTime.getHours();
		selfRef._currTask.eTime.m = selfRef._taskTime.getMinutes();
		selfRef._currTask.eTime.s = selfRef._taskTime.getSeconds();
		// send the task info to mainUI
		var event = {
				type:'TIME_OVER_EVENT',
				'id':selfRef._currTask.id,
				'name':selfRef._currTask.name,
				'eTime':selfRef._currTask.eTime,
				'priority':selfRef._currTask.priority
		};
		selfRef.dispatchEvent(event);
		
		// play break sound
		selfRef.playWorkEndSound();
		

	}else{
		if(selfRef._isBreaking){
			// finish break
			//selfRef._breakCount++;
			var status = 'time to work';
			goog.dom.setTextContent(selfRef._timerBoardDom, status);
			selfRef._isBreaking = false;
			selfRef._workBtn.setEnabled(true);
			selfRef._pauseBtn.setEnabled(false);
			
			selfRef.playBreakEndSound();
		}
		
	}
	
	

	
};

/*
 * set the ongoing task 
 * @param: task, an json object 
 * */
chr.myApp.timerUI.prototype.setTask = function(task){
	var self = this;
	if(!this._isWorking && !this._isPaused){
		this._currTask = task;
		//change the task status
		goog.dom.setTextContent(this._taskStatusDom,task.name+'--'+task.eTime.h+':'+task.eTime.m+':'+task.eTime.s);
	}else{
		alert('task can not be changed');
	}
};



/*
 * init the sound manager.
 * */
chr.myApp.timerUI.prototype.initSound = function(){
	var self = this;
	soundManager.onready(function(){
		var workEndSound = soundManager.createSound({
			id: 'workEndSound',
			url: 'sounds/mozart.mp3'
		});
		var breakEndSound = soundManager.createSound({
			id: 'breakEndSound',
			url: 'sounds/rain.mp3'
		});
		var tickSound = soundManager.createSound({
			id:'tickSound',
			url:'sounds/clock-ticking-4.mp3'
		});
		self._sound = {
			'workEndSound':workEndSound,
			'breakEndSound':breakEndSound,
			'tickSound':tickSound
		};
	}
	);
};

chr.myApp.timerUI.prototype.playWorkEndSound = function(){
	var self = this;
	soundManager.stopAll();
	self._sound.workEndSound.play({
		loops:1,
		volume:100
	});
};

chr.myApp.timerUI.prototype.playBreakEndSound = function(){
	var self = this;
	soundManager.stopAll();
	self._sound.breakEndSound.play({
		loops:10,
		volume:100
	});
};

chr.myApp.timerUI.prototype.playTickSound = function(){
	var self = this;
	soundManager.stopAll();
	self._sound.tickSound.play({
		loops:100000000,
		volume:200
	});
};

chr.myApp.timerUI.prototype.stopAllSound = function(){
	soundManager.stopAll();
};


chr.myApp.timerUI.prototype.setTickSound = function(enabled){
	if(this._isWorking){
		alert('cannot change during working');
		return false;
	}
	this._tickSound = enabled;
	return true;
};






