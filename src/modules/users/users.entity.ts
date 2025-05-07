import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Class } from '../classes/classes.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: ['student', 'coordinator', 'admin'],
    default: 'student',
  })
  role: 'student' | 'coordinator' | 'admin';

  @ManyToOne(() => Class, (classEntity) => classEntity.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: string;
}
