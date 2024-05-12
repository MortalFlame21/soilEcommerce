import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "longblob" })
  image: Buffer;

  @Column({ type: "boolean", default: false })
  onSale: boolean;

  @Column({ type: "int" })
  size: number;

  @Column({ type: "varchar", length: 50 })
  unit: string;
}
