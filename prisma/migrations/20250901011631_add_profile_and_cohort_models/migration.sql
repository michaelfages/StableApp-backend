-- CreateTable
CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "profileJson" TEXT,
    "firstName" TEXT NOT NULL,
    "lastNameInitial" TEXT NOT NULL,
    "pronouns" TEXT NOT NULL,
    "genderIdentity" TEXT NOT NULL,
    "orientation" TEXT NOT NULL,
    "miniInventories" TEXT,
    "fourPrompts" TEXT,
    "homeCity" TEXT NOT NULL,
    "matchRadius" INTEGER NOT NULL,
    "typicalNights" TEXT NOT NULL,
    "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cohort" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "members" TEXT NOT NULL,
    "weekStartDate" DATETIME NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");