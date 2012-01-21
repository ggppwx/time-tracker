goog.provide('chr.myApp.taskDB');

goog.require('goog.events');

chr.myApp.taskDB = function(){
	//TODO init the database 
	goog.base(this);
	var self = this;
	this._allTasks = {};
	this.tasks = {};
	this.tasks.webdb = {};
	this.tasks.webdb.db = null;
	
		
	this.open();
	this.createTable();
	this.getAllTasks();

	
};
goog.inherits(chr.myApp.taskDB,goog.events.EventTarget);


chr.myApp.taskDB.convertTime = function(timeInt){
	var h = Math.floor(timeInt/10000);
	timeInt = timeInt - h*10000;
	var m = Math.floor(timeInt/100);
	var s = timeInt-m*100;
	return {'h':h,'m':m,'s':s};
	
};

/*
 * open a data base 
 * */
chr.myApp.taskDB.prototype.open = function(){
	var dbSize = 5 * 1024 * 1024; // 5MB
	this.tasks.webdb.db = openDatabase('Task', '1.0', 'task manager', dbSize);
};

/*
 * create a table 
 * */
chr.myApp.taskDB.prototype.createTable = function(){
	this.tasks.webdb.db.transaction(function(tx) {
	    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + 
	                  'tasks(ID INTEGER PRIMARY KEY ASC, name TEXT, priority INTEGER, eTime INTEGER, active Yes)', []);
	  });
};


/*
 * add data to database 
 * */
chr.myApp.taskDB.prototype.addData = function(nameText, priorityInt, eTimeInt){
	 this.tasks.webdb.db.transaction(function(tx){
		    //var addedOn = new Date();
		    tx.executeSql('INSERT INTO tasks(name, priority, eTime, active) VALUES (?,?,?,?)', 
		        [nameText, priorityInt, eTimeInt,true],
		        this.onSuccess,
		        this.onError);
		    });

};

/*
 * get all tasks from the database 
 * return a list of task objects. 
 * */
chr.myApp.taskDB.prototype.getAllTasks = function(){
	var self = this;
	var proc = function(tx, tempRes){
		var resRows = [];
		for (var i=0; i < tempRes.rows.length; i++) {
			  var row = tempRes.rows.item(i);	
			  resRows.push({
				  'id':row.ID,
				  'name':row.name,
				  'priority':row.priority,
				  'eTime':chr.myApp.taskDB.convertTime(row.eTime),
				  'active':row.active
			  });
			  
		}
		// console.log(resRows);
		//self._allTasks = resRows;
		// send event to task ui
		var event = {
				type:'ALL_TASK_EVENT',
				'tasks':resRows
		};
		self.dispatchEvent(event);
		
	};
	
	self.tasks.webdb.db.transaction(function(tx) {
		//alert('1');
	    tx.executeSql('SELECT * FROM tasks', [], proc, 
	        self.onError);   //after finish this run function proc
	});
};




/*
 * delete data by id number 
 * */
chr.myApp.taskDB.prototype.delTaskById = function(id){
	 this.tasks.webdb.db.transaction(function(tx) {
		    tx.executeSql('DELETE FROM tasks WHERE ID=?', [id],
		        this.onSuccess,
		        this.onError);
		  });
};

/*
 * get task data by id 
 * return an task object 
 * */
chr.myApp.taskDB.prototype.getTaskById = function(id){
	
};

/*
 * set task data by id 
 * */
chr.myApp.taskDB.prototype.setTaskById = function(id,name,priority,eTime){
	//TODO update the database. 
	this.tasks.webdb.db.transaction(function(tx) {
	    tx.executeSql('UPDATE tasks SET name=?, priority=?,eTime=? WHERE ID=?', [name, priority,eTime,id],
	        this.onSuccess,
	        this.onError);
	  });
};

chr.myApp.taskDB.prototype.setTaskNameById = function(id,name){
	//TODO update the database. 
	this.tasks.webdb.db.transaction(function(tx) {
	    tx.executeSql('UPDATE tasks SET name=? WHERE ID=?', [name, id],
	        this.onSuccess,
	        this.onError);
	  });
};

chr.myApp.taskDB.prototype.setTaskPriorityById = function(id,priority){
	//TODO update the database. 
	this.tasks.webdb.db.transaction(function(tx) {
	    tx.executeSql('UPDATE tasks SET priority=? WHERE ID=?', [priority, id],
	        this.onSuccess,
	        this.onError);
	  });
};

chr.myApp.taskDB.prototype.setTaskEtimeById = function(id,eTime){
	//TODO update the database. 
	this.tasks.webdb.db.transaction(function(tx) {
	    tx.executeSql('UPDATE tasks SET eTime=? WHERE ID=?', [eTime, id],
	        this.onSuccess,
	        this.onError);
	  });
};

chr.myApp.taskDB.prototype.setActiveById = function(id,activeBool){
	//TODO update the database. 
	this.tasks.webdb.db.transaction(function(tx) {
	    tx.executeSql('UPDATE tasks SET active=? WHERE ID=?', [activeBool, id],
	        this.onSuccess,
	        this.onError);
	  });
};


/*
 * error
 * */
chr.myApp.taskDB.prototype.onSuccess = function(){
	
};

/*
 * success
 * */
chr.myApp.taskDB.prototype.onError = function(){
	alert('error');
};
