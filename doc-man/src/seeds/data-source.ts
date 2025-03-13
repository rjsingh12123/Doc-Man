import { User } from '../users/user.entity';
import { DataSource } from 'typeorm';
import { AppService } from '../app.service';
export const dataSource = new DataSource({
  type: AppService.getDbType() as any,
  host: AppService.getDbHost(),
  port: AppService.getDbPort(),
  username: AppService.getDbUsername(),
  password: AppService.getDbPassword(),
  database: AppService.getDb(),
  entities: [User],
  synchronize: true,
});
