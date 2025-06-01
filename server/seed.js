const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb'); // ObjectId is needed for linking documents
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const testUsers = [
	{
		_id: new ObjectId(), // Generate ObjectId for consistent referencing
		username: 'admin',
		password: '123',
		name: 'Admin',
		surname: 'User',
		age: 30,
		email: 'admin@example.com',
		role: 'admin',
		imageUrl: '',
	},
	{
		_id: new ObjectId(), // Generate ObjectId for consistent referencing
		username: 'user',
		password: '123',
		name: 'Regular',
		surname: 'User',
		age: 25,
		email: 'user@example.com',
		role: 'user',
		imageUrl: '',
	},
];

const sampleCategories = [
	{ _id: new ObjectId(), name: 'Science', description: 'Test your knowledge of scientific facts and principles.' },
	{ _id: new ObjectId(), name: 'History', description: 'Explore important events and figures from the past.' },
	{ _id: new ObjectId(), name: 'Pop Culture', description: 'Trivia about movies, music, and modern trends.' },
];

const sampleQuizzes = [
	{
		_id: new ObjectId(),
		title: 'Basic Chemistry',
		description: 'A quiz on fundamental chemistry concepts.',
		categoryId: sampleCategories[0]._id,
		timelimit: 10,
		timestamp: new Date(),
	},
	{ _id: new ObjectId(), title: 'World War II Trivia', description: 'Key events and figures of WWII.', categoryId: sampleCategories[1]._id, timelimit: 15, timestamp: new Date() },
	{
		_id: new ObjectId(),
		title: 'Modern Movie Buff',
		description: 'Questions about recent blockbuster movies.',
		categoryId: sampleCategories[2]._id,
		timelimit: 0,
		timestamp: new Date(),
	},
];

const sampleQuestions = [
	// Science Questions
	{ _id: new ObjectId(), text: 'What is the chemical symbol for water?', options: ['H2O', 'CO2', 'O2', 'NaCl'], answer: 'H2O', timestamp: new Date() },
	{ _id: new ObjectId(), text: 'What planet is known as the Red Planet?', options: ['Mars', 'Jupiter', 'Saturn', 'Venus'], answer: 'Mars', timestamp: new Date() },
	{
		_id: new ObjectId(),
		text: 'What is the speed of light?',
		options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'],
		answer: '300,000 km/s',
		timestamp: new Date(),
	},
	// History Questions
	{ _id: new ObjectId(), text: 'In what year did World War II end?', options: ['1945', '1939', '1918', '1941'], answer: '1945', timestamp: new Date() },
	{
		_id: new ObjectId(),
		text: 'Who was the first President of the United States?',
		options: ['George Washington', 'Thomas Jefferson', 'Abraham Lincoln', 'John Adams'],
		answer: 'George Washington',
		timestamp: new Date(),
	},
	// Pop Culture Questions
	{
		_id: new ObjectId(),
		text: 'Which movie won the Best Picture Oscar in 2020?',
		options: ['Parasite', '1917', 'Joker', 'Once Upon a Time in Hollywood'],
		answer: 'Parasite',
		timestamp: new Date(),
	},
	{
		_id: new ObjectId(),
		text: 'What is the name of the lead singer of the band Queen?',
		options: ['Freddie Mercury', 'Brian May', 'Roger Taylor', 'John Deacon'],
		answer: 'Freddie Mercury',
		timestamp: new Date(),
	},
];

const sampleAssignedQuestions = [
	// Assign questions to Basic Chemistry Quiz
	{ quizId: sampleQuizzes[0]._id, questionId: sampleQuestions[0]._id },
	{ quizId: sampleQuizzes[0]._id, questionId: sampleQuestions[1]._id },
	{ quizId: sampleQuizzes[0]._id, questionId: sampleQuestions[2]._id },
	// Assign questions to World War II Trivia Quiz
	{ quizId: sampleQuizzes[1]._id, questionId: sampleQuestions[3]._id },
	{ quizId: sampleQuizzes[1]._id, questionId: sampleQuestions[4]._id },
	// Assign questions to Modern Movie Buff Quiz
	{ quizId: sampleQuizzes[2]._id, questionId: sampleQuestions[5]._id },
	{ quizId: sampleQuizzes[2]._id, questionId: sampleQuestions[6]._id },
];

const sampleQuizResults = [
	{ userId: testUsers[1]._id, quizId: sampleQuizzes[0]._id, score: 2, totalQuestions: 3, questionsAnswered: 3, timestamp: new Date() },
	{ userId: testUsers[1]._id, quizId: sampleQuizzes[1]._id, score: 1, totalQuestions: 2, questionsAnswered: 2, timestamp: new Date() },
];

async function seedDB() {
	const uri = process.env.DB_CONNECTION_STRING;
	if (!uri) {
		console.error('DB_CONNECTION_STRING is not defined in your .env file.');
		process.exit(1);
	}

	const client = new MongoClient(uri);

	try {
		await client.connect();
		console.log('Connected successfully to MongoDB server');

		const database = client.db('quizdb');

		// Seed Users
		const usersCollection = database.collection('users');
		for (const testUser of testUsers) {
			const existingUser = await usersCollection.findOne({ username: testUser.username });
			if (existingUser) {
				console.log(`User "${testUser.username}" already exists. Skipping.`);
			} else {
				const hashedPassword = await bcrypt.hash(testUser.password, 10);
				// Use the pre-generated _id from testUsers array
				await usersCollection.insertOne({ ...testUser, password: hashedPassword });
				console.log(`User "${testUser.username}" added successfully.`);
			}
		}

		// Seed Categories
		const categoriesCollection = database.collection('categories');
		for (const category of sampleCategories) {
			const existingCategory = await categoriesCollection.findOne({ name: category.name });
			if (existingCategory) {
				console.log(`Category "${category.name}" already exists. Skipping.`);
			} else {
				await categoriesCollection.insertOne(category);
				console.log(`Category "${category.name}" added successfully.`);
			}
		}

		// Seed Quizzes
		const quizzesCollection = database.collection('quizzes');
		for (const quiz of sampleQuizzes) {
			const existingQuiz = await quizzesCollection.findOne({ title: quiz.title });
			if (existingQuiz) {
				console.log(`Quiz "${quiz.title}" already exists. Skipping.`);
			} else {
				await quizzesCollection.insertOne(quiz);
				console.log(`Quiz "${quiz.title}" added successfully.`);
			}
		}

		// Seed Questions
		const questionsCollection = database.collection('questions');
		for (const question of sampleQuestions) {
			const existingQuestion = await questionsCollection.findOne({ text: question.text });
			if (existingQuestion) {
				console.log(`Question "${question.text.substring(0, 20)}..." already exists. Skipping.`);
			} else {
				await questionsCollection.insertOne(question);
				console.log(`Question "${question.text.substring(0, 20)}..." added successfully.`);
			}
		}

		// Seed AssignedQuestions
		const assignedQuestionsCollection = database.collection('assignedQuestions');
		for (const aq of sampleAssignedQuestions) {
			// A more robust check might be needed if combination needs to be unique
			const existingAQ = await assignedQuestionsCollection.findOne({ quizId: aq.quizId, questionId: aq.questionId });
			if (existingAQ) {
				console.log(`AssignedQuestion for quizId ${aq.quizId} and questionId ${aq.questionId} already exists. Skipping.`);
			} else {
				await assignedQuestionsCollection.insertOne(aq);
				console.log(`AssignedQuestion for quizId ${aq.quizId} and questionId ${aq.questionId} added successfully.`);
			}
		}

		// Seed QuizResults
		const quizResultsCollection = database.collection('quizResults');
		for (const result of sampleQuizResults) {
			// This check assumes a user takes a specific quiz only once for seeding purposes.
			// Real-world scenarios might allow multiple attempts.
			const existingResult = await quizResultsCollection.findOne({ userId: result.userId, quizId: result.quizId });
			if (existingResult) {
				console.log(`QuizResult for userId ${result.userId} and quizId ${result.quizId} already exists. Skipping.`);
			} else {
				await quizResultsCollection.insertOne(result);
				console.log(`QuizResult for userId ${result.userId} and quizId ${result.quizId} added successfully.`);
			}
		}
	} catch (err) {
		console.error('Error during seeding:', err);
	} finally {
		await client.close();
		console.log('MongoDB connection closed.');
	}
}

seedDB();
