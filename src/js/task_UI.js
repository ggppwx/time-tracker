goog.provide('chr.myApp.taskUI');

goog.require('goog.editor.Table');
goog.require('goog.dom');
goog.require('goog.dom.classes');

goog.require('goog.ui.Button');
goog.require('goog.ui.FlatButtonRenderer');
goog.require('goog.ui.LinkButtonRenderer');
goog.require('goog.events');

goog.require('goog.ui.LabelInput');

goog.require('chr.myApp.taskDB');

test_data = [
  {'id':0,'priority':1,'name':'my task', 'eTime':0 },
  {'id':1,'priority':2,'name':'my task2', 'eTime':0 },
  {'id':2,'priority':3,'name':'my task3', 'eTime':0 },
  {'id':3,'priority':1,'name':'my task4', 'eTime':0 }
];


chr.myApp.taskUI = function(node){
	goog.base(this);
	var self = this;
	this._currentTaskIdx = 0;
	this._tasks = test_data;
	
	this._taskTableDom =  goog.dom.createDom('div',{id:'task-table'});
	goog.dom.appendChild(node, this._taskTableDom);
	
	// adding tasks
	this._addDom =  goog.dom.createDom('div',{id:'task-add'});	
	this._taskNametext = new goog.ui.LabelInput();
	this._taskNametext.render(this._addDom);
	this._addBtn = new goog.ui.Button('add');
	this._addBtn.render(this._addDom);
	goog.dom.appendChild(node,this._addDom);
	
	//TODO clear history.
	var auxDom = goog.dom.createDom('div',{id:'aux-bar'});
	this._clearBtn = new goog.ui.Button('clear');
	this._clearBtn.render(auxDom);
	goog.dom.appendChild(node,auxDom);
	
	
	//TODO get the tasks from databases 
	this._taskDB = new chr.myApp.taskDB();
	//var data = this._taskDB.getAllTasks();

	
	// listen to the event
	var handleClearHis = function(e){
		//TODO clear all inactive tasks 
		var data = self._tasks;
		for(var item in data){
			if(data[item].active !== 'true'){
				self._taskDB.delTaskById(data[item].id);
			}
		}
		self._taskDB.getAllTasks(); // refresh. 
	};
	goog.events.listen(this._clearBtn, goog.ui.Component.EventType.ACTION, handleClearHis);
	
	var refresh = function(e){
		console.log(e.tasks);
		self._tasks = e.tasks;
		self._populateTable(self._tasks, self._taskTableDom);
	};
	goog.events.listen(this._taskDB, 'ALL_TASK_EVENT',
		    refresh, false, this);
	
	/*
	 * handle add task.  
	 * */
	var handleAddTask = function(e){
		var text = self._taskNametext.getValue();
		//TODO add task.
		var task = chr.myApp.taskUI.parseText(text);
		console.log(task);
		self._taskDB.addData(task.name, task.priority, 0);
		self._taskDB.getAllTasks(); // refresh.
	};
	goog.events.listen(this._addBtn, goog.ui.Component.EventType.ACTION, handleAddTask);

};
goog.inherits(chr.myApp.taskUI, goog.events.EventTarget);



/*
 * populate the table with data 
 * */
chr.myApp.taskUI.prototype._populateTable = function(data, tableDom){
	var self = this;  
	//clear all children
	goog.dom.removeChildren(tableDom);
	for(var item in data){	
		if(data[item].active === 'true'){
			self._addRow(tableDom, data[item], item);
		}else{
			self._addDoneRow(tableDom,data[item],item);
		}
	}
};
/*
 * add row to the table 
 * */
chr.myApp.taskUI.prototype._addRow = function(node, row, rowId){
	var self = this;
	var idx = rowId;
	//text
	var cell1Dom = goog.dom.createDom('div','cell-priority');
	goog.dom.setTextContent(cell1Dom,row.priority);
	var cell2Dom = goog.dom.createDom('div',{id:'name'+rowId,'class':'cell-name'});
	goog.dom.setTextContent(cell2Dom,row.name);
	var cell3Dom = goog.dom.createDom('div',{id:'eTime'+rowId,'class':'cell-elapsed-time'});
	goog.dom.setTextContent(cell3Dom,row.eTime.h+':'+row.eTime.m+':'+row.eTime.s);
	var rowTextDom = goog.dom.createDom('div','row-text',cell1Dom, cell2Dom, cell3Dom);
	
	//btn
	var cell4Dom = goog.dom.createDom('div',{id:'btn'+rowId,'class':'cell-btn'});
	var cell5Dom = goog.dom.createDom('div','cell-btn');
	var cellbtn1 = new goog.ui.Button('sel');
	var cellbtn2 = new goog.ui.Button('done');
	var cellbtn3 = new goog.ui.Button('del', goog.ui.LinkButtonRenderer.getInstance());
	//cellbtn.setValue(item);
	cellbtn1.render(cell4Dom);
	cellbtn2.render(cell4Dom);
	cellbtn3.render(cell5Dom);
	var rowDom = goog.dom.createDom('div','table-row',rowTextDom,cell4Dom,cell5Dom);
	goog.events.listen(cellbtn1, goog.ui.Component.EventType.ACTION, function(e){
		// get task by task id 
		var task = self._tasks[idx];
		// send event object to main ui
		var event = {
				type:'TASK_EVENT',
				'id':task.id,
				'name':task.name,
				'priority':task.priority,
				'eTime':task.eTime
				
		};
		self.dispatchEvent(event);
	});
	goog.events.listen(cellbtn2, goog.ui.Component.EventType.ACTION, function(e){
		//TODO finish the task. 
		var task = self._tasks[idx];
		self._taskDB.setActiveById(task.id, false);		
		//refresh
		self._taskDB.getAllTasks(); // refresh.
		
	});
	goog.events.listen(cellbtn3, goog.ui.Component.EventType.ACTION, function(e){
		var taskId = self._tasks[idx].id;
		self._taskDB.delTaskById(taskId);
		//TODO delete item in array _tasks
		goog.dom.removeNode(rowDom);
	});
	goog.dom.appendChild(node, rowDom);
	
};


chr.myApp.taskUI.prototype._addDoneRow = function(node, row, rowId){
	var self = this;
	var idx = rowId;
	//text
	var cell1Dom = goog.dom.createDom('div','cell-priority');
	goog.dom.setTextContent(cell1Dom,row.priority);
	var cell2Dom = goog.dom.createDom('div',{id:'name'+rowId,'class':'cell-name'});
	goog.dom.setTextContent(cell2Dom,row.name);
	var cell3Dom = goog.dom.createDom('div',{id:'eTime'+rowId,'class':'cell-elapsed-time'});
	goog.dom.setTextContent(cell3Dom,row.eTime.h+':'+row.eTime.m+':'+row.eTime.s);
	var rowTextDom = goog.dom.createDom('div','row-text',cell1Dom, cell2Dom, cell3Dom);
	var delDom = goog.dom.createDom('del','',cell1Dom,cell2Dom,cell3Dom);
	goog.dom.appendChild(rowTextDom,delDom);	
	var rowDom = goog.dom.createDom('div','table-row',rowTextDom);
	goog.dom.appendChild(node, rowDom);
	
};




/*
 * get the task by task id. 
 * */
chr.myApp.taskUI.prototype.getTask = function(tid){
	
	return;
};

/*
 * set the task by task id. 
 * */
chr.myApp.taskUI.prototype.setTask = function(tid, task){
	//TODO set the database 
	var timeInt = task.eTime.h*10000+task.eTime.m*100+task.eTime.s;
	this._taskDB.setTaskById(tid, task.name, task.priority, timeInt);
	this._taskDB.getAllTasks(); //refresh 
	//this._populateTable(data, this._taskTableDom);
};



/*
 * parse the text to task format. 
 * the text is like "task name !priority =estimate_time"
 * */
chr.myApp.taskUI.parseText = function(text){
	// get priority
	var res = text.match('!([0-9])');
	var priority = 0;
	var h = 0;
	var m = 0;
	if(res !== null){
		priority = parseInt(res[1]);
		text = text.replace(/![0-9]/,'');
	}
	// get estimate time 
	var res = text.match('=([0-9]+):([0-9]+)');
	if(res !== null){
		h = parseInt(res[1]);
		m = parseInt(res[2]);
		text = text.replace(/=[0-9]+:[0-9]+/,'');
	}
	var name = text.replace(/^\s+|\s+$/g, '');
	return {
		'name':name,
		'priority':priority,
		'estTime':{'h':h,'m':m,'s':0}
	};
	
};



