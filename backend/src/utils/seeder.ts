import { User } from '../models/User.js';
import { hashPassword } from './auth.utils.js';

/** Seeding database with a default user if empty */
export const seedDatabase = async () => {
  try {
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('[seeder]: No users found. Seeding default test user...');
      const hashedPassword = await hashPassword('password123');
      await User.create({
        username: 'testuser',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'User',
      });
      console.log('[seeder]: Default test user seeded successfully (user@example.com / password123)');
    } else {
      console.log('[seeder]: Database already has users. Skipping seeding.');
    }
  } catch (error) {
    console.error('[seeder]: Error seeding database:', error);
  }
};
