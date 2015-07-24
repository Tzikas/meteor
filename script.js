Memries = new Mongo.Collection("memries");

if (Meteor.isClient) {

	// This code only runs on the client
	var app = angular.module("simple-memry",['angular-meteor']);

	function onReady() {
		angular.bootstrap(document, ['simple-memry']);
	}

	if (Meteor.isCordova)
		angular.element(document).on("deviceready", onReady);
	else
		angular.element(document).ready(onReady);

	angular.module("simple-memry").controller("listCtrl", ['$scope', '$meteor',
			function($scope, $meteor){

			$scope.$meteorSubscribe("memries");

			$scope.memries = $meteor.collection(function() {
				return Memries.find($scope.getReactively('query'), {sort: {createdAt: -1}})
				});

			$scope.addMemry = function(newMemry){
				$meteor.call("addMemry", newMemry);
			};

			$scope.deleteMemry = function(memry){
				$meteor.call("deleteMemry", memry._id);
			};

			$scope.setChecked = function(memry){
				$meteor.call("setChecked", memry._id, !memry.checked);
			};

			$scope.setPrivate = function(memry){
				$meteor.call("setPrivate", memry._id, ! memry.private);
			};

			$scope.$watch('hideCompleted', function() {
					if ($scope.hideCompleted)
					$scope.query = {checked: {$ne: true}};
					else
					$scope.query = {};
					});

			$scope.incompleteCount = function () {
				return Memries.find({checked: {$ne: true}}).count();
			};

			$scope.takePicture = function(){ //Not sure where to put this pic functionality 
				$meteor.getPicture().then(function(data){
					$scope.imageData = data;//I don't think i need this
					$meteor.call("addMemry", data);
					
				});
			};
			
			$scope.sendEmail = function(){ //I don't really need this. This is the button
				$meteor.call("sendEmail",
				'niko.tzikas@gmail.com',
				'niko.tzikas@gmail.com',
				'Dude from Meteor!',
				'whateva this This is a test of Email.send.')
			};
			
			$scope.answerBox = function(answer){
				$('h1').css({'color':'red'});
				console.log(answer);
			}

	}]);

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});

	app.directive('scrollOnClick', function() {
		return {
			restrict: 'A',
			link: function(scope, $elm) {
				$elm.on('click', function() {
					$('body').animate({scrollTop: $elm.offset().top}, 200,
						function() { 
							//$('footer .answer-box input').animate({'height':'4em'}, 200)
							//$('footer .answer-box input').focus();
							console.log($elm[0].children[1].innerText);
							$elm[0].children[1].innerText = '' 
						}

					);
					//console.log($elm);
//					setTimeout(function() { $('footer .answer-box input').animate({'height':'4em'}, 200)},200);
					//$('footer .answer-box input').addClass('up');
					//setTimeout(function(){scope.boolChangeClass = true;}, 400);
				});
			}
		}
	});

	app.directive("scroll", function ($window) {
		return function(scope, element, attrs) {
			angular.element($window).bind("scroll", function() {
				//scope.boolChangeClass = false;
				$('footer .answer-box input').css({'height':'0em'})
				if (this.pageYOffset >= 100) {
					//scope.boolChangeClass = true;
					//console.log('Scrolled below header.');
				} else {
					//scope.boolChangeClass = false;
					//console.log('Header is in view.');
				}
				scope.$apply();
			});
		};
	});

}


Meteor.methods({
	addMemry: function (text) {
	// Make sure the user is logged in before inserting a memry
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

//function changeTime(date, milliseconds) {
  //  return new Date(date.getTime() + milliseconds);
//}
		var remindDate = new Date(new Date().getTime() + 20000)
		var words = text.split(' ');
		var wordsObj = {}	
		for(var w=0; w<words.length; w++){ wordsObj[words[w].replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ")] = 0}		
		
		Memries.insert({
			text: text,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username,
			strength: 1,
			remindDate: remindDate,
			image: text,
			words: wordsObj,
			});

		//deliverMemry(text);
	},
	deleteMemry: function (memryId) {
		var memry = Memries.findOne(memryId);
		if (memry.private && memry.owner !== Meteor.userId()) {
			// If the memry is private, make sure only the owner can delete it
			throw new Meteor.Error("not-authorized");
		}
		Memries.remove(memryId);
	},
	setChecked: function (memryId, setChecked) {
	 	var memry = Memries.findOne(memryId);
	    	if (memry.private && memry.owner !== Meteor.userId()) {
		// If the memry is private, make sure only the owner can check it off
			throw new Meteor.Error("not-authorized");
	    	}
		Memries.update(memryId, { $set: { checked: setChecked} });
	},
	setPrivate: function (memryId, setToPrivate) {
		var memry = Memries.findOne(memryId);

		// Make sure only the memry owner can make a memry private
		if (memry.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Memries.update(memryId, { $set: { private: setToPrivate } });
	},

	fakeRandom: function(x){  //Returns an array that seems random, but isn't.  
		if(x==2){return [1, 0];}
		var z = x;  
		var y = x;
		var r = Math.floor(x/2);
		var arr = []; 
		while( x%r%2 == 0 ) {r++;}
		while( x>0 ){
			y = y - r;
			if(y<0){
				var n = y;
				y = z + n 
			}   
			arr.push(y);	
			x--
		}
		console.log(arr);
		return arr;  
	} 

});








function taskToDo(){
	console.log('called')
}




function addId( word, newWord ){//Add span, class and id 
	
	word = word.trim().replace(/[^a-zA-Z ]/g, "_");
	var spanny = ' <span class="'+word+' w_o_r_d_s" id="'+word+'">'+newWord+'</span>';//style="color:sienna;border:1px dashed blue;" contenteditable="true"
	return spanny;
}



function fadeLetter( word, t, f, z ){
	if( word.length != 1 ){
		$(document.getElementsByClassName(word)).find('spanny:nth-child(' + (z + 1) + ')').animate({opacity:0}, {duration:t}).text();
	} else {
		$(document.getElementsByClassName(word)).find('spanny:nth-child(' + (z) + ')').animate({opacity:0}, {duration:t}).text();//var char = $(document.getElementsByClassName(word)).find('spanny').eq(z).animate({opacity:0}, {duration:t}).text();//$('.' + word + ' spanny:nth-child(' + (z + 1) + ')').animate({opacity:0}, {duration:t});
	}
}


function spanIt(){
	$(document.getElementsByClassName(word)).html(function(){
	     return this.textContent.replace(/./g,'<spanny>$&</spanny>');
	});
}

function fakeRandom (x){  //Returns an array that seems random, but isn't.  
	if(x==2){return [1, 0];}
	var z = x;  
	var y = x;
	var r = Math.floor(x/2);
	var arr = []; 
	while( x%r%2 == 0 ) {r++;}
	while( x>0 ){
		y = y - r;
		if(y<0){
			var n = y;
			y = z + n 
		}   
		arr.push(y);	
		x--
	}
	console.log(arr);
	return arr;  
} 

function splitMemry(memry){
	
	var letters = memry.split('')
	var words = memry.split(' ');
	console.log(letters);
	var arr = fakeRandom(words.length);
	for(a=0; a<arr; a++){
		
	}
	return words;
}
























/*
if (Meteor.isServer) {
	Meteor.publish("memries", function () {
		return Memries.find({
			$or: [
				{ private: {$ne: true} },
				{ owner: this.userId }
			]
		});
	});

	console.log(3);

	Meteor.methods({

		sendEmail: function (to, from, subject, text, repeat) {
			console.log(2);

			check([to, from, subject, text], [String]);

			// Let other method calls from the same client start running,
			// without waiting for the email sending to complete.
			this.unblock();
			//Meteor.setInterval(console.log('testes'), 3000);

				Email.send({
					to: to,
					from: from,
					subject: subject,
					text: text
				});
		
		}
	})

}

if (Meteor.isServer) {
	Meteor.startup(function () {
		process.env.MAIL_URL = 'smtp:postmaster@sandboxcebcb183c2f647e88fa16475c3c2308d.mailgun.org:bc1b80e504132efd231dc9e294e9dce5@smtp.mailgun.org:587';
	});//Meteor.startup(function () {//process.env.MAIL_URL = 'smtp://postmaster%40meteorize.mailgun.org:YOURPASSWORD@smtp.mailgun.org:587';//  process.env.MAIL_URL = 'smtp://postmaster@sandboxcebcb183c2f647e88fa16475c3c2308d.mailgun.org:bc1b80e504132efd231dc9e294e9dce5';//smtp://USERNAME:PASSWORD@HOST:PORT/  //process.env.MAIL_URL = 'smtp:postmaster@sandboxcebcb183c2f647e88fa16475c3c2308d.mailgun.org:bc1b80e504132efd231dc9e294e9dce5@smtp.mailgun.org:587';//});

	//
}
*/
