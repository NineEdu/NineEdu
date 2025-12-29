import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load auto-generated swagger documentation
const swaggerFile = join(__dirname, 'swagger-output.json');
let specs = {};

try {
  const data = readFileSync(swaggerFile, 'utf8');
  specs = JSON.parse(data);
} catch (error) {
  console.warn('⚠️  Swagger documentation not found. Run "npm run swagger" to generate it.');
  specs = {
    openapi: '3.0.0',
    info: {
      title: 'NineEdu API',
      version: '1.0.0',
      description: 'Run "npm run swagger" to generate documentation'
    },
    paths: {}
  };
}

export default specs;
