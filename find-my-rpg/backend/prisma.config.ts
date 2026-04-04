import { defineConfig } from "prisma/config";
import "dotenv/config"; // Isso ensina o Prisma 7 a ler o seu arquivo .env

export default defineConfig({
  datasource: {
    url: process.env.DIRECT_URL,
  },
});

// no terminal
// npx prisma migrate dev --name init 