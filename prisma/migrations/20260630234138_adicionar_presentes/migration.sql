-- CreateTable
CREATE TABLE "Presente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "imagemUrl" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "linkCredito" TEXT,
    "linkPix" TEXT,
    "comprado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Presente_pkey" PRIMARY KEY ("id")
);
