import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

interface UrlCreationAttrs {
  url: string;
}

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  longUrl: string;

  @Column({ unique: true })
  shortCode: string;

  @Column({ default: 0 })
  visitCount: number;
}
