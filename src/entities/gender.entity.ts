import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subgender } from "./subgender.entity";

@Entity({ name: "genders" })
export class Gender {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Subgender, (subgender) => subgender.gender)
  subgenders: Subgender[];
}
