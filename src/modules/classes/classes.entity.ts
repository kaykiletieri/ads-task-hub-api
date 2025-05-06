import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['1', '2', '3', '4', '5'], default: '1' })
  axis: string;

  @Column({
    type: 'enum',
    enum: ['2025/1', '2025/2', '2026/1'],
    default: '2025/1',
  })
  period: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: string;

  @OneToMany(() => User, (user) => user.class, {
    onDelete: 'SET NULL',
  })
  users: User[];
}
