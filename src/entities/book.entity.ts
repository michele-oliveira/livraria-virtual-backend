import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Subgender } from "./subgender.entity";

@Entity({ name: "books" })
export class Book {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  image_1: string;

  @Column()
  image_2: string;

  @Column()
  book_name: string;

  @Column()
  author: string;

  @Column()
  publisher: string;

  @Column()
  language: string;

  @Column()
  pages: number;

  @Column()
  description: string;

  @Column()
  book_file: string;

  @ManyToOne(() => Subgender)
  @JoinColumn({ name: "subgender_id" })
  subgender: Subgender;
}
