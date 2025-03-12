import { DataSource } from 'typeorm';
import { User, UserRole, UserPermissions } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

export const seedUsers = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);

  const users = { username: 'admin', password: await bcrypt.hash('password', 10), role: UserRole.ADMIN, permissions: [UserPermissions.ALL], email: 'admin@example.com', phone: '+1234567890' };

  await userRepository.insert(users);
  console.log('Users seeded successfully');
};
