import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('periods')
export class Period {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  year: number;

  @Column({ type: 'enum', enum: ['1', '2'], default: '1' })
  semester: string;

  @Column()
  axis: number;

  @Column({ unique: true })
  unique_period: string; // Ex: 2025-1-Eixo1

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: string;
}
