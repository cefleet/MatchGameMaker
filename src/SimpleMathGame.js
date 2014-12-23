var SimpleMathGame = function(name,options){
  this.name = name || 'My Math Game';
  options = options || {};

  //Game
  this.constant = options.constant || null; //if null then it can be anything in the range
  this.range = options.range || [1,100];//range is an array
  this.operator = options.operator || 'add'; //add,subtract,devide,multiply
  this.random = options.random || false;//if it is random it will ask random questions
  this.incorrectLimit = options.incorrectLimit || 4;//When to goto end

  //Game Data
  this.incorrect = {};//array of {index : indexNo, times : noOfTimesMissed}
  this.incorrectCount = 0;
  this.correct = []; //the index of one when it is correctly gotten
  this.remaining = [];
  this.equations = [];

};

SimpleMathGame.prototype = {
  /*
  * Setup Sets up the game for different types
  */
  setup : function(){
    //If there is no constant then the whole range times the range is the possibilities
    if(!this.constant){
      this.equationsCount = this.range[1]*this.range[1];
      var s = 1;
      var c = 0;

    } else {
      this.equationsCount = this.range[1];
      var c = this.constant;
    }

    for(var i = 0; i < this.equationsCount; i++){
      if(!this.constant){
        if(c >= this.range){
          s++;
          c = 0;
        }
        var sec = (c+1)/s;
        c++;
      } else {
        var sec = (i+1);
      }

      var e = {
        index : i,
        equation : {
          first_number : c,
          operator : this.operator,
          second_number : sec
        },
        results : this._results(this.constant,this.operator,sec)
      }
      this.equations.push(e);
      this.remaining.push(i); //sets the index of the remaining ones
    }

    if(!this.random){
      this.onQuestion = 0;
    } else {
      this.onQuestion = this.remianing[this._randBetween(0,this.remaining.length)];
    }

  },

  start : function(){
    //display the list
    this.makeQuestion();
  },

  makeQuestion : function(){
    var q = this.equations[this.onQuestion];
    return q;
  },

  evaluateQuestion : function(answer){
    //possibly need to make both numbers
    if(answer === this.equations[this.onQuestion].results)
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
    this.incorrectCount++;
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

  _results : function(f,o,s){
    var results;
    switch(o){
      case 'add':
        results = f+s;
        break;
      case 'subtract':
        results = f-s;
        break;
      case 'multiply':
        results = f*s;
        break;
      case 'divide' :
        results = f/s;
        break;
    }
    return results;
  },

  _tryRandomQuestion : function(){
    if(this.correct.length < this.equations.length){
      var index = this._randBetween(0,this.remaining.length);
      this.onQuestion = this.remaining[index];
    } else {
      this.end('win');
    }
  },

  _tryNextQuestion : function(){
    if(this.correct.length < this.equations.length){
      this.onQuestion ++;

      if(this.onQuestion > this.equations.length-1){
        this.onQuestion = 0;
      }

      if(this.correct.indexOf(this.onQuestion) > -1){
        this._tryNextQuestion();
      }
    } else {
      this.end('win');
    }
  },

  _randBetween : function(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
  }
}
