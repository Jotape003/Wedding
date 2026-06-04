import 'dotenv/config'

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const connectionString = process.env.DATABASE_URL!

const pool = new pg.Pool({
  connectionString,
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  console.log('⏳ Conectando ao Neon...')

  await prisma.convite.upsert({
    where: { codigo: 'NOIVOS2026' },
    update: {},
    create: {
      codigo: 'NOIVOS2026',
      nomeExibicao: 'João Pedro & Ester',
      maxAcompanhantes: 0,
      isAdmin: true,
    },
  })

  await prisma.convite.upsert({
    where: { codigo: 'TESTE123' },
    update: {},
    create: {
      codigo: 'TESTE123',
      nomeExibicao: 'Família Silva',
      maxAcompanhantes: 2,
      isAdmin: false,
    },
  })

  console.log('✅ Seed concluído!')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })