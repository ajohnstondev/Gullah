# Migration `20200906155341-make-parent-id-nullable-on-category`

This migration has been generated by Dillon Raphael at 9/6/2020, 11:53:41 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Category" ALTER COLUMN "parentId" DROP NOT NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200906153935-remove-properties-from-product..20200906155341-make-parent-id-nullable-on-category
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 datasource db {
   // provider = ["sqlite", "postgres"]
   provider = ["postgres"]
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -61,25 +61,22 @@
   description  String     
   storefront   Storefront @relation(fields: [storefrontId], references: [id])
   storefrontId Int
   categories   Category[]
-  gallery      Gallery
-  // properties   Json[]       
+  gallery      Gallery       
 }
 model Category {
   id        Int      @default(autoincrement()) @id
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
   title     String
   parent    Boolean
-  parentId  Int
+  parentId  Int?
   stores    Storefront[]
   products  Product[]
 }
-
-
 model Gallery {
   id        Int      @default(autoincrement()) @id
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
```

