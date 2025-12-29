import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'NineEdu API Documentation',
    description: 'API documentation for LMS system',
    version: '1.0.0',
  },
  host: 'localhost:5002',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Courses', description: 'Course management' },
    { name: 'Lessons', description: 'Lesson management' },
    { name: 'Enrollments', description: 'Course enrollment' },
    { name: 'Quizzes', description: 'Quiz management' },
    { name: 'AI', description: 'AI-powered features' },
    { name: 'Payment', description: 'Payment processing' },
    { name: 'Dashboard', description: 'Dashboard analytics' },
    { name: 'Users', description: 'User management' },
    { name: 'Transactions', description: 'Transaction history' },
    { name: 'Conversations', description: 'Course discussions and conversations' },
    { name: 'Certificates', description: 'Certificate management' },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your bearer token in the format: Bearer {token}',
    },
  },
};

const outputFile = './src/configs/swagger-output.json';
const routes = ['./src/server.js'];

swaggerAutogen()(outputFile, routes, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
});