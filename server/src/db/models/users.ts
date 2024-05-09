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
  @Length(5, 30, {
    message: "Username must be \u2265 5 and \u2264 30 characters in length!",
  })
  @Column()
  username: string;

  // will do unique l8r
  @IsEmail(undefined, {
    message: "Invalid email sent",
  })
  @Column()
  email: string;

  @Column()
  hash: string;

  @CreateDateColumn()
  dateJoined: Date;
}
