import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Period } from '../../periods/periods.entity';
import { User } from '../../users/users.entity';
import { ClassToken } from './class-token.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 1, nullable: false })
  class_number: number;

  @Column({ type: 'varchar', nullable: true })
  teacher_name?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
    transformer: {
      from: (value: string) => value,
      to: (value: string) => value,
    },
  })
  created_at: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
    onUpdate: 'CURRENT_TIMESTAMP',
    transformer: {
      from: (value: string) => value,
      to: (value: string) => value,
    },
  })
  updated_at: string;

  @OneToMany(() => User, (user) => user.class)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  users: User[];

  @ManyToOne(() => Period, (period) => period.classes, { nullable: false })
  @JoinColumn({ name: 'period_id', referencedColumnName: 'id' })
  period: Period;

  @OneToMany(() => ClassToken, (classToken) => classToken.class)
  @JoinColumn({ name: 'class_token_id', referencedColumnName: 'id' })
  classTokens: ClassToken[];
}
