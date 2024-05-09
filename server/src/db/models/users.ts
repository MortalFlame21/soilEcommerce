import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";
import { IsDate, IsEmail, Length } from "class-validator";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  // will do unique l8r
  @Length(10, 20)
  @Column()
  username: string;

  // will do unique l8r
  @IsEmail()
  @Column()
  email: string;

  @Column()
  hash: string;

  @IsDate()
  @CreateDateColumn()
  dateJoined: Date;
}
