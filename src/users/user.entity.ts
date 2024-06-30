import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  email: string;

  // @AfterInsert()
  // logInsert() {
  //   console.log(`User has been inserted with ID=${this.id}`);
  // }

  // @AfterUpdate()
  // logUpdate() {
  //   console.log(`User has been updated with ID=${this.id}`);
  // }

  // @AfterRemove()
  // logRemove() {
  //   console.log(`User has been removed with ID=${this.id}`);
  // }
}
