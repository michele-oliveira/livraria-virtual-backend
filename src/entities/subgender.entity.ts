import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Gender } from "./gender.entity";

@Entity({ name: "subgenders" })
export class Subgender {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Gender)
  @JoinColumn({ name: "gender_id" })
  gender: Gender;
}
