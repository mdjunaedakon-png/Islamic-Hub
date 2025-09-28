const { execSync } = require('child_process');
const path = require('path');

console.log('🌱 Starting database seeding...');

try {
  // Run the TypeScript seed file
  execSync('npx tsx lib/seedData.ts', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
  });
  
  console.log('✅ Seeding completed successfully!');
} catch (error) {
  console.error('❌ Error running seed script:', error.message);
  process.exit(1);
}
