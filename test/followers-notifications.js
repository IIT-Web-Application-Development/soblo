//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
var userList = [];
var remindersList = [];
var mainServerPath = "/or/"; //"/users/";

chai.use(chaiHttp);
//Our parent block
describe('Notifications', () => {

    beforeEach((withDummyData) => { //Add dummy data before specific tests
		let blogTitle = { blogTitle : "Hello" }
		
		chai.request(server)
			.post(mainServerPath +'oruiz/notifications')
			.send(blogTitle)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('title');
				res.body.title.should.eql('Success');
				withDummyData();
			});
	});

/*
    afterEach((withDummyData) => { //Add dummy data before specific tests
			chai.request(server)
				.delete('/users/0')
				.end((err, res) => {
					res.should.have.status(204);
					withDummyData();
				});
	});
*/
	/*
	* Test the /GET route
	*/
	
	describe('/GET Notifications', () => {
		it('it should NOT GET a list of notifications by the given id - User does NOT exist', (withDummyData) => {
			chai.request(server)
				.get(mainServerPath +'fakeUser/notifications')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(404);
					res.body.message.should.eql('No user found');
					withDummyData();
				});
		});
	});

	/*
	* Test the /GET route
	*/
	
	describe('/GET Notifications', () => {
		it('it should GET an empty list of notifications by the given id - User does NOT have any notifications', (withDummyData) => {
			chai.request(server)
				.get(mainServerPath +'oruiz/notifications')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('notificationList');
					withDummyData();
				});
		});
	});

	/*
	* Test the /GET route
	*/
	
	describe('/GET Notifications', () => {
		it('it should GET a list of notifications by the given id - User has a notification with Title of "Hello"', (withDummyData) => {
			chai.request(server)
				.get(mainServerPath +'drakaric/notifications')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('notificationList');
					res.body.notificationList.should.be.a('array');
					(res.body.notificationList[0]).blogTitle.should.equal('Hello');
					withDummyData();
				});
		});
	});

	/*
	* Test the /GET route
	*/
	
	describe('/GET Notifications', () => {
		it('it should GET a single notification by the given user and notification IDs - User has a notification with Title of "Hello"', (withDummyData) => {
			chai.request(server)
				.get(mainServerPath +'drakaric/notifications/1')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('notificationList');
					res.body.notificationList.id.should.equal(1);
					res.body.notificationList.blogTitle.should.equal('Hello');
					withDummyData();
				});
		});
	});

	/*
	* Test the /GET route
	*/
	
	describe('/GET Notifications', () => {
		it('it should NOT GET a single notification by the given user and notification IDs - User has NO permission to view this notification', (withDummyData) => {
			chai.request(server)
				.get(mainServerPath +'oruiz/notifications/2')
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('title');
					res.body.should.have.property('message');
					res.body.title.should.equal('Error');
					res.body.message.should.equal('User not allowed to view this notification.');
					withDummyData();
				});
		});
	});

	/*
	* Test the /GET route
	*/
	
	describe('/GET Notifications', () => {
		it('it should NOT GET a single notification by the given user and notification IDs - User does NOT exist', (withDummyData) => {
			chai.request(server)
				.get(mainServerPath +'fakeUser/notifications/2')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('title');
					res.body.should.have.property('message');
					res.body.title.should.equal('Error');
					res.body.message.should.equal('No user found');
					withDummyData();
				});
		});
	});

	/*
	* Test the /POST route
	*/
	describe('/POST Notifications', () => {
		it('it should POST a notification for the given user with a Title of "My Notification"', (withDummyData) => {
			let blogTitle = { blogTitle : "My Notification" }
		
			chai.request(server)
				.post(mainServerPath +'jdoe/notifications')
				.send(blogTitle)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.title.should.eql('Success');
					withDummyData();
				});
		});
	});

	/*
	* Test the /POST route
	*/
	describe('/POST Notifications', () => {
		it('it should NOT POST a notification for the given user - User does NOT exist', (withDummyData) => {
			let blogTitle = { blogTitle : "My Notification" }
		
			chai.request(server)
				.post(mainServerPath +'fakeUser/notifications')
				.send(blogTitle)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.title.should.eql('Error');
					withDummyData();
				});
		});
	});

	/*
	* Test the /PUT route
	*/
	describe('/PUT Notifications', () => {
		it('it should UPDATE the list of allowed followers that can view this notification - Used to mark a notification as "Read"', (withDummyData) => {
			let blogTitle = { blogTitle : "My Notification" }
		
			chai.request(server)
				.put(mainServerPath +'drakaric/notifications/5')
				.send(blogTitle)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.should.have.property('message');
					res.body.title.should.eql('Success');
					res.body.message.should.eql('Successfully read the notification.');
					withDummyData();
				});
		});
	});

	/*
	* Test the /PUT route
	*/
	describe('/PUT Notifications', () => {
		it('it should NOT UPDATE the list of allowed followers that can view this notification - Used is not allowed to view this notifiation', (withDummyData) => {
			let blogTitle = { blogTitle : "My Notification" }
		
			chai.request(server)
				.put(mainServerPath +'oruiz/notifications/6')
				.send(blogTitle)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.should.have.property('message');
					res.body.title.should.eql('Error');
					res.body.message.should.eql('User not allowed to view this notification.');
					withDummyData();
				});
		});
	});
	
	/*
	* Test the /PUT route
	*/
	describe('/PUT Notifications', () => {
		it('it should NOT UPDATE the list of allowed followers that can view this notification - Used is not found', (withDummyData) => {
			let blogTitle = { blogTitle : "My Notification" }
		
			chai.request(server)
				.put(mainServerPath +'fakeUser/notifications/6')
				.send(blogTitle)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.should.have.property('message');
					res.body.title.should.eql('Error');
					res.body.message.should.eql('No user found');
					withDummyData();
				});
		});
	});
});

describe('Subscribers/Followers', () => {
	/*
	* Test the /POST route
	*/
	describe('/POST Followers', () => {
		it('it should POST a new follower for the given user - Successfully subscribe as follower to a user', (withDummyData) => {
			//let blogTitle = { blogTitle : "My Notification" }
		
			chai.request(server)
				.post(mainServerPath +'jdoe/follow')
				//.send(blogTitle)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.title.should.eql('Success');
					res.body.message.should.eql('Successfully subscribed to user.');
					withDummyData();
				});
		});
	});

	/*
	* Test the /POST route
	*/
	describe('/POST Followers', () => {
		it('it should NOT POST a new follower for the given user - Already subscribed/following this user', (withDummyData) => {
			//let blogTitle = { blogTitle : "My Notification" }
		
			chai.request(server)
				.post(mainServerPath +'jdoe/follow')
				//.send(blogTitle)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.title.should.eql('Warning');
					res.body.message.should.eql('Already following user.');
					withDummyData();
				});
		});
	});

	/*
	* Test the /POST route
	*/
	describe('/POST Followers', () => {
		it('it should NOT POST a new follower for the given user - User does NOT exist', (withDummyData) => {
			//let blogTitle = { blogTitle : "My Notification" }
		
			chai.request(server)
				.post(mainServerPath +'fakeUser/follow')
				//.send(blogTitle)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.title.should.eql('Error');
					res.body.message.should.eql('No user found');
					withDummyData();
				});
		});
	});

	/*
	* Test the /PUT route
	*/
	describe('/PUT Followers', () => {
		it('it should UPDATE the list of followers for the given user - Successfully unsubscribe as follower to a user', (withDummyData) => {
			//let blogTitle = { blogTitle : "My Notification" }
		
			chai.request(server)
				.put(mainServerPath +'jdoe/follow')
				//.send(blogTitle)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.title.should.eql('Success');
					res.body.message.should.eql('Successfully unsubscribed to user.');
					withDummyData();
				});
		});
	});

	/*
	* Test the /PUT route
	*/
	describe('/PUT Followers', () => {
		it('it should NOT UPDATE the list of followers for the given user - Already unsubscribed as follower to a user', (withDummyData) => {
			//let blogTitle = { blogTitle : "My Notification" }
		
			chai.request(server)
				.put(mainServerPath +'jdoe/follow')
				//.send(blogTitle)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.title.should.eql('Warning');
					res.body.message.should.eql('Already unsubscribed to user.');
					withDummyData();
				});
		});
	});


	/*
	* Test the /PUT route
	*/
	describe('/PUT Followers', () => {
		it('it should NOT UPDATE the list of followers for the given user - User does NOT exist', (withDummyData) => {
			//let blogTitle = { blogTitle : "My Notification" }
		
			chai.request(server)
				.put(mainServerPath +'fakeUser/follow')
				//.send(blogTitle)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.title.should.eql('Error');
					res.body.message.should.eql('No user found');
					withDummyData();
				});
		});
	});
});
