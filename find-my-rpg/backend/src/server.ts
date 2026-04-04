// src/server.ts
import 'dotenv/config'; // LÊ O SEU COFRE (.env) ANTES DE TUDO!
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// ==========================================
// CONFIGURAÇÃO DO BANCO DE DADOS (Prisma 7+)
// ==========================================
// 1. Cria a piscina de conexões usando o driver oficial do Postgres
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// 2. Conecta o driver oficial ao Prisma (O Motor)
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR (Express)
// ==========================================
const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Rota de Teste (Ping)
//app.get('/', request, response) => {
app.get('/ping', async (req, res) => {
  try {
    // Conta quantos usuários existem no banco
    const usersCount = await prisma.user.count();
    
    res.status(200).json({ 
      status: 'success', 
      message: 'Pong! Servidor online e conectado ao banco de dados com sucesso.',
      usuarios_cadastrados: usersCount
    });
  } catch (error) {
    console.error("Erro no banco:", error);
    res.status(500).json({ status: 'error', message: 'Falha ao conectar no banco.' });
  }
});

// Ligando a máquina
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor do RPG online e escutando na porta ${PORT}`);
});