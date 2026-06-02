/// <reference types="node" />
import { spawn } from 'child_process';

async function globalTeardown() {
  console.log('Resetting database after testing');

  return new Promise((resolve, reject) => {
    const seed = spawn('pnpm', ['--filter', 'database', 'db:seed'], {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd(),
    });

    seed.on('close', (code: number | null) => {
      if (code === 0) {
        console.log('Database successfully reset after testing');
        resolve(undefined);
      } else {
        console.error(`Database reset failed (exit code: ${code})`);
        reject(new Error(`Database reset failed with exit code ${code}`));
      }
    });

    seed.on('error', (err: unknown) => {
      console.error('Database reset failed:', err);
      reject(err as Error);
    });
  });
}

export default globalTeardown;