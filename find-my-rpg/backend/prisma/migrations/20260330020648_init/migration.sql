-- CreateEnum
CREATE TYPE "Sistema" AS ENUM ('DND_5E', 'LANCER', 'TORMENTA20', 'CALL_OF_CTHULHU', 'PATHFINDER_2E', 'VAMPIRO_A_MASCARA', 'OUTROS');

-- CreateEnum
CREATE TYPE "Tematica" AS ENUM ('FANTASIA_MEDIEVAL', 'SCI_FI_MECHA', 'CYBERPUNK', 'TERROR_INVESTIGACAO', 'POS_APOCALIPTICO');

-- CreateEnum
CREATE TYPE "Modalidade" AS ENUM ('REMOTO', 'PRESENCIAL');

-- CreateEnum
CREATE TYPE "VttTool" AS ENUM ('TABLETOP_SIMULATOR', 'FOUNDRY_VTT', 'ROLL20', 'OWLBEAR_RODEO', 'DISCORD_THEATER_OF_THE_MIND', 'OUTROS');

-- CreateEnum
CREATE TYPE "TipoCampanha" AS ENUM ('MODULO_PUBLICADO', 'HOME_BREW');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nome_perfil" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sistema" "Sistema" NOT NULL,
    "tematica" "Tematica" NOT NULL,
    "modalidade" "Modalidade" NOT NULL,
    "cidade" VARCHAR(120),
    "vtt" "VttTool" NOT NULL,
    "tipo_campanha" "TipoCampanha" NOT NULL,
    "historia_ambientacao" TEXT NOT NULL,
    "vagas_totais" INTEGER NOT NULL,
    "vagas_preenchidas" INTEGER NOT NULL DEFAULT 0,
    "tem_gm" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
