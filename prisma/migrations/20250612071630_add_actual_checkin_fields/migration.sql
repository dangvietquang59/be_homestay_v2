/*
  Warnings:

  - Added the required column `actualCheckIn` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualCheckOut` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "actualCheckIn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "actualCheckOut" TIMESTAMP(3) NOT NULL;
