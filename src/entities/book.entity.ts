import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
  gender: string;

  @Column()
  description: string;

  @Column()
  book_file: string;
}
