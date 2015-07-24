

Meteor.publish("memries", function () {
	return Memries.find({
		$or: [
			//{ private: {$ne: true} },
			{ owner: this.userId }
		]
	});
});

Meteor.methods({

	sendEmail: function (to, from, subject, text) {
		check([to, from, subject, text], [String]);

		// Let other method calls from the same client start running,
		// without waiting for the email sending to complete.
		this.unblock();
		//Meteor.setInterval(console.log('testes'), 3000);
		console.log('sending email '+text) 
		Email.send({
			to: to,
			from: from,
			subject: subject,
			text: text
		});console.log('sent email') 
	},
	
	scheduleMailTimes:  function (to, from, subject, text) {
		check([to, from, subject, text], [String]);

		console.log('scheduleMailTimes is called')
		/*		
		
	
		Meteor.setInterval(function(){
			console.log('this is called again');
			Email.send({
				to: to,
				from: from,
				subject: subject,
				text: text
			});
			console.log('sent email again') 	
		}, 10000); 

		*/
	}
	

})





//FutureTasks = new Meteor.Collection('future_tasks'); // server-side only


Meteor.startup(function () {
	process.env.MAIL_URL = 'smtp:postmaster@sandboxcebcb183c2f647e88fa16475c3c2308d.mailgun.org:bc1b80e504132efd231dc9e294e9dce5@smtp.mailgun.org:587';
		
	//Meteor.setInterval(remindMemry, 60000);  //Checks for memories that need to be sent. 

});//Meteor.startup(function () {//process.env.MAIL_URL = 'smtp://postmaster%40meteorize.mailgun.org:YOURPASSWORD@smtp.mailgun.org:587';//  process.env.MAIL_URL = 'smtp://postmaster@sandboxcebcb183c2f647e88fa16475c3c2308d.mailgun.org:bc1b80e504132efd231dc9e294e9dce5';//smtp://USERNAME:PASSWORD@HOST:PORT/  //process.env.MAIL_URL = 'smtp:postmaster@sandboxcebcb183c2f647e88fa16475c3c2308d.mailgun.org:bc1b80e504132efd231dc9e294e9dce5@smtp.mailgun.org:587';//});


function remindMemry(){
	Memries.find().forEach(function(memry) {
		if (memry.remindDate < new Date()) {
			console.log('past ');
			console.log(memry);
			send(memry)	
			updateRemind(memry)
		} else {
			console.log('future ');
			console.log(memry);
		}
	});
}

function changeTime(date, milliseconds) {
    return new Date(date.getTime() + milliseconds);
}


function updateRemind(memry){


	var newTime = memry.strength * 60000
	console.log(newTime);
	var newDate = changeTime(new Date(), newTime);
	Memries.update({"_id" : ""+memry._id+""},{
		"$set":{"remindDate" : newDate},
		"$inc":{"strength" : 1}
	})
}

function send(memry){
		//this.unblock();
		Email.send({
			to: 'niko.tzikas@gmail.com',
			from: 'niko.tzikas@gmail.com',
			subject: 'Dude you Kickass',
			text: memry.text
		});
		console.log('sent email') 
}


/*
FutureTasks = new Meteor.Collection('future_tasks'); // server-side only

// In this case, "details" should be an object containing a date, plus required e-mail details (recipient, content, etc.)

function changeTime(date, milliseconds) {
    return new Date(date.getTime() + milliseconds);
}


function sendMail(details) {
	console.log(' in sendMail '); 

	console.log(details);

	var newDate = changeTime(new Date(), 10000);
	console.log(newDate);
	
	//FutureTasks.//find by ID and update 
	//FutureTasks.update({"_id" : details.id},{"$set":{"date" : newDate}})


	Email.send({
		from: details.from,
	        to: details.to,
        	subject:new Date(),
		text: details.date
		//date: details.date
	});

}

function addTask(id, details) {
	console.log(' in addTask '); 

	console.log(id)

	SyncedCron.add({
		name: id,
		schedule: function(parser) {
			return parser.recur().on(details.date).fullDate();
		},
		job: function() {
			sendMail(details);
			FutureTasks.remove(id); //What's goin on here? 
			SyncedCron.remove(id);
	        	return id;
		}
	});

}

function scheduleMail(details) { 
	console.log(' in scheduleMail '); 

	if (details.date < new Date()) {
		sendMail(details);
	} else {
		var thisId = FutureTasks.insert(details);
		addTask(thisId, details);		
	}
	return true;

}


Meteor.startup(function() {
	console.log(' in startup '); 
	process.env.MAIL_URL = 'smtp:postmaster@sandboxcebcb183c2f647e88fa16475c3c2308d.mailgun.org:bc1b80e504132efd231dc9e294e9dce5@smtp.mailgun.org:587';

	FutureTasks.find().forEach(function(mail) {
		if (mail.date < new Date()) {
			sendMail(mail)
		} else {
			addTask(mail._id, mail);
		}
	});
	SyncedCron.start();

});


var dat = changeTime(new Date(), 20000);
var date = String(new Date());
var detaily = {'to':'niko.tzikas@gmail.com',
		'from':'niko.tzikas@gmail.com',
		'subject':'wassup',
		'text': dat,
		'date': dat}

scheduleMail(detaily) 

*/












/*
function instertFuture(){


	var dat = changeTime(new Date(), 10000);
	console.log('dat is '+dat);

	FutureTasks.insert({
		'to':'niko.tzikas@gmail.com',
		'from':'niko.tzikas@gmail.com',
		'subject':'sup',
		'text': dat,
		'date': dat
	})
instertFuture()

}*/


