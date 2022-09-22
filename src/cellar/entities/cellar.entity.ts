import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Cellar')
export class Cellar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'bigint' })
  capacity: number;

  @Column()
  owner: string;
}
