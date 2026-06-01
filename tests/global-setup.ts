import { spawn } from 'child_process';

async function globalSetup() {
  console.log('Seeding database for testing');
  
  return new Promise((resolve, reject) => {
    const seed = spawn('pnpm', ['--filter', 'database', 'db:seed'], {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd(),
    });

    seed.on('close', (code) => {
      if (code === 0) {
        console.log('Database successfully seeded');
        resolve(undefined);
      } else {
        console.error(`Database seeding failed (exit code: ${code})`);
        reject(new Error(`Database seeding failed with exit code ${code}`));
      }
    });

    seed.on('error', (err) => {
      console.error('Database seeding failed:', err);
      reject(err);
    });
  });
}

export default globalSetup;
