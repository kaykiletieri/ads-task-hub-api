import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Nome da turma, exemplo: "ADS - 1º Semestre"

  @Column({ type: 'enum', enum: ['1', '2', '3', '4', '5'], default: '1' })
  axis: string; // Eixo da turma, exemplo: "Eixo 1"

  @Column({
    type: 'enum',
    enum: ['2025/1', '2025/2', '2026/1'],
    default: '2025/1',
  })
  period: string; // Período da turma, exemplo: "2025/1"

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: string;
}
