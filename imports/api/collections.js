import { Mongo } from "meteor/mongo";

export const Categories = new Mongo.Collection("categories");
// model Category {
//   id    Int    @id @default(autoincrement())
//   name  String
//   items Item[]
// }

export const Items = new Mongo.Collection("items");
// model Item {
//   id         Int      @id @default(autoincrement())
//   name       String
//   published  Boolean  @default(true)
//   category   Category @relation(fields: [categoryId], references: [id])
//   categoryId Int
//   createdAt  DateTime @default(now())
//   updatedAt  DateTime @updatedAt
// }

export const Stores = new Mongo.Collection("stores");
// model Store {
//   id            Int             @id @default(autoincrement())
//   name          String
//   user          User            @relation(fields: [userId], references: [id])
//   userId        String
//   StoreCategory StoreCategory[]
// }

export const StoreCategories = new Mongo.Collection("storeCategories");
// model StoreCategory {
//   id           Int    @id @default(autoincrement())
//   order        Int
//   categoryName String
//   categoryId   Int
//   store        Store  @relation(fields: [storeId], references: [id])
//   storeId      Int
// }

// model User {
//   id     String     @id @default(uuid())
//   email  String     @unique
//   name   String?
//   items  UserItem[]
//   stores Store[]
// }

export const UserItems = new Mongo.Collection("userItems");
// model UserItem {
//   id           Int      @id @default(autoincrement())
//   user         User     @relation(fields: [userId], references: [id])
//   userId       String
//   itemName     String
//   itemId       Int
//   categoryName String
//   categoryId   Int
//   picked       Boolean  @default(false)
//   createdAt    DateTime @default(now())
//   updatedAt    DateTime @default(now())
// }
