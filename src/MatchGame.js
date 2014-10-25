var MatchGame = function(name,options){
	this.name = name || 'My Matching Game';
	options = options || {};
	
	//GUI
	this.backgroundImage = options.backgroundImage || null;
	this.backgroundColor = options.backgroundColor || '#00548F';
	this.textColor = options.textColor || '#FFFAD5';	
	this.layout = options.layout || 'landscape';
	
	//Game
	this.solutionType = options.selectionType || 'text';//text, numbers,images
	this.solutionOptions = options.selectionOptions || ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y'];//can be a list or range
	this.problemBase = options.ProblemBase || ''; //This is you are doing something like 4*x = 
	this.problemOptions = options.problemOptions || ['b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']; //can be a list or range
	this.problemPreText = options.preText || 'What comes after ';
	this.problemPostText = options.postText || ' ?';
	this.gameType = options.gameType || 'sequenceNext'; //Matching,SequenceNext,SequencePrevious, Math
	this.formula = options.formula || 'equals'; //equals,multiply,divide,add,subtract // or array of more then one 
	this.itemsInBox = options.itemsInBox || 1; //This is the number of items from solution options in the box
	this.random = options.random || false;//if it is random it will ask random questions
	this.incorrectLimit = options.incorrectLimit || 4;//When to goto end
	
	//Game Data
	this.incorrect = {};//array of {index : indexNo, times : noOfTimesMissed}
	this.incorrectCount = 0;
	this.correct = []; //the index of one when it is correctly gotten	
	this.remaining = [];
	
}

MatchGame.prototype = {
	/*
	 * Setup Sets up the game for different types
	 */
	setup : function(){
			//Probably will need multipe files for each game type
		if(['sequenceNext','sequencePrevious'].indexOf(this.gameType) > -1){
			this.formula = 'equals';	
		}
		if(!this.random){
			this.onQuestion = 0;
		} else {
			this.onQuestion = this.remianing[this._randBetween(0,this.remaining.length)];
		}
		for(var i = 0; i<this.problemOptions.length; i++){
			this.remaining.push(i);
		}
	},
	
	start : function(){
		//display the list
		this._createClickableSelections();
		this.makeQuestion();
	},
	
	makeQuestion : function(){
		var question = this.problemPreText+this.solutionOptions [this.onQuestion]+this.problemPostText;
		console.log(question);
	},
	
	//nextQuestion
	nextQuestion : function(){
		var question;
		if(this.random){
			this._tryRandomQuestion();
		} else {
			this._tryNextQuestion();						
		}
		this.makeQuestion();
	},
	
	
	//gotQuestionWrong
	gotQuestionWrong : function(){
		this.incorrectCount ++;		
		if(this.incorrectCount >= this.incorrectLimit){
			this.end('fail');
		} else {
			if(!this.incorrect[this.onQuestion]) {
				this.incorrect[this.onQuestion] = 1;
			}  else {
				this.incorrect[this.onQuestion] ++;
			}
			this.nextQuestion();
		}
	},
	
	//gotQuestionRight
	gotQuestionRight : function(){
		var i = this.remaining.indexOf(this.onQuestion);
		this.remaining.splice(i,1);
		this.correct.push(i);
		this.nextQuestion();
	},
	
	//end
	end : function(status){
		if(status === 'win'){
			console.log('Good Job Young Padawon. You have completed this level');
		} else if(status === 'fail'){
			console.log('you have failed Missiberaly, and You must pay the consequences');			
		}
		this.setup();
	},
	
	_tryRandomQuestion : function(){
		if(this.correct.length < this.problemOptions.length){
			var index = this._randBetween(0,this.remaining.length);
			this.onQuestion = this.remaining[index]; 
		} else {
			this.end('win');
		}
	},
	
	_tryNextQuestion : function(){
		if(this.correct.length < this.problemOptions.length){
			this.onQuestion ++;
			
			if(this.onQuestion > this.problemOptions.length-1){
				this.onQuestion = 0;
			}
				
			if(this.correct.indexOf(this.onQuestion) > -1){
				this._tryNextQuestion();
			}
		} else {
			this.end('win');
		}	
	},
	
	_createClickableSelections : function(){
		//add then to the stage.
	},
	
	_randBetween : function(min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	}
}
