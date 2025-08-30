import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'API delivery',
    description: ''
  },
  host: 'localhost:3001'
};

const outputFile = './swagger-output.json';
const routes = ['../index.ts'];

swaggerAutogen()(outputFile, routes, doc);
