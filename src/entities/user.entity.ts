import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Book } from "./book.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @ManyToMany(() => Book)
  @JoinTable({
    name: "users_favorite_books",
    joinColumn: { name: "user_id" },
    inverseJoinColumn: { name: "book_id" },
  })
  favoriteBooks: Book[];
}
