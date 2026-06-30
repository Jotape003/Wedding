-- CreateTable
CREATE TABLE "MensagemMural" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aprovada" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MensagemMural_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MensagemMural_createdAt_idx" ON "MensagemMural"("createdAt" DESC);
