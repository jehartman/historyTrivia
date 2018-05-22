var questions = [
	"On September 25, 1820, what did the residents of Salem NJ put on trial?", 
	"When Edgar Allen Poe was busy writing, he:",  
	"Which of the following WWII despots was NOT nominated for the Nobel Peace Prize?",
	"___________ forbade people from entering his bedroom. To test their adherence to this rule, he would call out in distress, and anyone who entered his room to check on his well-being would be ___________.",
	"What was a Liberty Steak?",
	"Radiation at Chernobyl was so intense that:",
	"In 1944, what WWII munition killed an entire family in Oregon?",
	"How did the Inca write?",
	"An Aztec way to get rich was to:",
	"What is notable about the Anglo-Zanzibar War?"
	];
var answers = [
	["a basket of tomatoes", "a local hilltop", "the Holy Bible", "the former mayor's ghost"],
	["plucked quills from parrots", "kept a cat on his shoulder", "preferred squid ink", "wore only shoes"],
	["Josef Stalin", "Adolf Hitler", "Emperor Hirohito", "Benito Mussolini"],
	["Josef Stalin; executed", "Richard Strauss; physically attacked", "Simon Bolivar; abandoned in the wild", "Babe Ruth; doused with gin"],
	["remnants of book burned by Chairman Mao's revolutionaries ", "a buffalo nickel during the Depression", "an empty plate during the occupation of Paris", "a hamburger during WWII"],
	["three-eyed frogs were afterwards caught up to 45 miles away", "the earth's crust sank 25 feet", "a fireman's eyes were turned from brown to blue", "the region did not experience full darkness for months due to the reactor glow"],
	["a grenade in a sack of government flour", "a balloon bomb launched from Japan", "an aerial practice bomb that rolled two miles downhill", "a depth charge stolen by locals and buried in a wheat field "],
	["by arranging stones in temple walls", "by carving shapes in root vegetables", "in mud protected by banana fronds", "by knotting strings"],
	["promise your skull to temple priests", "sell your own children", "raise jaguar cubs to adulthood", "serve eleven years as the local water taster"],
	["It lasted only 38 minutes", "It took place mostly on river barges", "The only combatants were nobles", "The winning side rode rhinos to victory"]
	];
var currentQuestion = 0;
var totalQuestions = questions.length; 
var correctAnswers = 0;
var indexOfAnswer = [0, 1, 2, 0, 3, 2, 1, 3, 1, 0];
var indexOfAnswerChosen;
var clockRunning = false;
var intervalId;
//next two variables are used to set which timer interval is active
var timerInterval = 30;
var answerInterval = 5;
//this is the interval used by the clock
var activeInterval;
//determines when certain clicks are allowed to fire
var clickToggle = true;
var jump = true;


window.onload = function() {
  $("#startButton").on("click", hideStart);
};

//hides start panel and reveals game panel
function hideStart () {
	$('#startPanel').addClass('invisible');
	$('#gamePanel').removeClass('invisible');
	activeInterval = timerInterval;
	pushQuestion();
}

//clock object
var clock = {

	time: 0,

	reset: function () {
		clockRunning = false;
		clock.time = 0;
		},

	start: function () {
		if (!clockRunning) {
			intervalId = setInterval(clock.count, 1000); 
			clockRunning = true;
			}
		},

	count: function () {
		//displays countdown if clock is running
		if (clock.time + 1 < activeInterval && clockRunning === true) {
			clock.time++;
			if (activeInterval == timerInterval) {
				$("#timerDisplay").text(activeInterval - clock.time);
			}
			else {
				$("#guessResponseTimer").text(activeInterval - clock.time);
			}
		}
		//if clock not running or interval expired fires next action
		else {
			clearInterval(intervalId);
		    clockRunning = false;
		    clock.reset();	
			if (activeInterval == timerInterval) {
				$('#timerWrapper').addClass('invisible');
				$('#jumpContainer').removeClass('invisible');
				activeInterval = answerInterval;
				showAnswer();
			}
			else {
				activeInterval = timerInterval;
				$('#responseContainer').addClass('invisible');
				nextQuestion();
			}
		}
	},
};

//pushes question text to html and restarts clock
function pushQuestion () {
	$("#timerDisplay").text(timerInterval - clock.time);	
	clock.start();
	jump = true;
	$('#questionContainer').removeClass('invisble');
	activeInterval = timerInterval;
	var question = questions[currentQuestion];
	$("#question").html(question);	
	for (var i=0; i<4; i++) {
		var targetArray = answers[currentQuestion];	
		$("#option" + i).html(targetArray[i]);
	}
}

//displays answer, resets clock, moves to next question
function showAnswer (x) {
	$('#responseContainer').removeClass('invisible');
	if (x == indexOfAnswer[currentQuestion]) {
		correctAnswers++;
		$("#guessResponse").html("<p>Correct!</p>");
	}
	else if (x) {
		$("#guessResponse").html("<p> That is incorrect. The correct answer is " + 	answers[currentQuestion][indexOfAnswer[currentQuestion]] + ".</p>");
	}
	else {
		$("#guessResponse").html("<p>Time's up. The correct answer is " + 	answers[currentQuestion][indexOfAnswer[currentQuestion]] + ".</p>");
	}
	clock.reset();
	countdownToNext();

};

//starts answerInterval timer
function countdownToNext () {
	clockRunning = false;
	clearInterval(intervalId);
	activeInterval = answerInterval;
	clock.start();
	$("#guessResponseTimer").text(activeInterval);
}

//displays next question and starts timerInterval timer
function nextQuestion () {
	$('#timerWrapper').removeClass('invisible');
	clickToggle = true;
	jump = false;
	$("#timerDisplay").text(timerInterval - clock.time);	
	if (currentQuestion + 1 < totalQuestions) {
		currentQuestion++;
		intervalId = timerInterval;
		clock.start();
		pushQuestion();
	}
	else {
		quizOver();
	}
};

//displays score
function quizOver () {
	clearInterval(intervalId);
	$('#gamePanel').addClass('invisible');
	$('#endScore').text(correctAnswers);
	$('#endPanel').removeClass('invisible');
}

//register option click, allows jump, disallows futher option clicks
$(".option").on("click", (function () {
	$('#timerWrapper').addClass('invisible');
	$('#jumpContainer').removeClass('invisible');
	if (clickToggle == true) {
		jump = true;
		clickToggle = false;
		indexOfAnswerChosen = $(this).attr("value");
		showAnswer(indexOfAnswerChosen);
	}
	else {
	}
}));

//jumps to next question
$('#jumpContainer').on('click', function () {
	if (jump) {
		$('#responseContainer').addClass('invisible');
		$('#jumpContainer').addClass('invisible');
		clearInterval(intervalId);
		clock.reset();
		nextQuestion();
	}
});
