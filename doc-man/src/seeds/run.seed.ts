import { seedUsers } from './user.seed';
import { dataSource } from './data-source';
const seed = async () => {
  await dataSource.initialize();
  console.log('Database connected');

  await seedUsers(dataSource);

  await dataSource.destroy();
  console.log('Seeding complete');
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
});
