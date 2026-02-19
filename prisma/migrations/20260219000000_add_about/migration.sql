-- CreateTable
CREATE TABLE "About" (
    "id" TEXT NOT NULL,
    "icon" VARCHAR(10) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "About_order_idx" ON "About"("order");
