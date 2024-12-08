/*
  Warnings:

  - You are about to drop the `attendees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `attendee_id` on the `check_ins` table. All the data in the column will be lost.
  - Added the required column `invite_id` to the `check_ins` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "attendees_event_id_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "attendees";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "invites" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_id" TEXT NOT NULL,
    CONSTRAINT "invites_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_check_ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invite_id" INTEGER NOT NULL,
    CONSTRAINT "check_ins_invite_id_fkey" FOREIGN KEY ("invite_id") REFERENCES "invites" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_check_ins" ("created_at", "id") SELECT "created_at", "id" FROM "check_ins";
DROP TABLE "check_ins";
ALTER TABLE "new_check_ins" RENAME TO "check_ins";
CREATE UNIQUE INDEX "check_ins_invite_id_key" ON "check_ins"("invite_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "invites_event_id_email_key" ON "invites"("event_id", "email");
