-- CreateTable
CREATE TABLE "Familia" (
    "id" TEXT NOT NULL,
    "nomeExibicao" TEXT NOT NULL,
    "codigoAcesso" TEXT NOT NULL,

    CONSTRAINT "Familia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Convidado" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "vaiComparecer" BOOLEAN,
    "familiaId" TEXT NOT NULL,

    CONSTRAINT "Convidado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Familia_codigoAcesso_key" ON "Familia"("codigoAcesso");

-- AddForeignKey
ALTER TABLE "Convidado" ADD CONSTRAINT "Convidado_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "Familia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
