//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

// Test the users
describe('Users', () => {

	describe('/GET User', () => {
		it('it should NOT return a user - User does NOT exist', (withDummyData) => {
			chai.request(server)
				.get('/users/fakeUser')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.error.should.eql('User not found');
					withDummyData();
				});
		});
	});

	describe('/GET User', () => {
		it('it should return a user', (withDummyData) => {
			chai.request(server)
				.get('/users/drakaric')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('user');
					res.body.user.userName.should.eql('drakaric');
					res.body.user.firstName.should.eql('Daniel');
					res.body.user.lastName.should.eql('Rakaric');
					withDummyData();
				});
		});
	});
});

// Test the login process
describe('Login', () => {

	describe('/POST login', () => {
		it('it should return a 401 status - Invalid Credentials', (withDummyData) => {
			chai.request(server)
				.post('/login')
				.send({"userName":"drakaric","password":"welcome"})
				.end((err, res) => {
					res.should.have.status(401);
					withDummyData();
				});
		});
	});

	describe('/POST login', () => {
		it('it should return a 200 status - Valid Credentials', (withDummyData) => {
			chai.request(server)
				.post('/login')
				.send({"userName":"drakaric","password":"welcome123"})
				.end((err, res) => {
					res.should.have.status(200);
					withDummyData();
				});
		});
	});
});

// Test the sign up process
describe('Sign Up', () => {

	describe('/POST sign-up', () => {
		it('it should return a 200 status', (withDummyData) => {
			chai.request(server)
				.post('/sign-up')
				.send({"userName":"drakaric1","email":"drakaric1@gmail.com","firstName":"Danial","lastName":"Rakaric","password":"welcome123"})
				.end((err, res) => {
					res.should.have.status(200);
					withDummyData();
				});
		});
	});
});