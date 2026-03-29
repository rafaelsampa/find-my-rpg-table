import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { createClient } from "@/lib/supabase/server";
import {
  Dice6,
  Search,
  Users,
  Wand2,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-24 text-center lg:py-32">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Sua próxima aventura começa aqui</span>
              </div>
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Encontre sua{" "}
              <span className="text-primary">Mesa de RPG</span> perfeita
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
              Conecte-se com jogadores e mestres. Descubra campanhas que combinam
              com seu estilo. Crie memórias épicas em aventuras inesquecíveis.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/buscar">
                <Button size="lg" className="gap-2">
                  <Search className="h-5 w-5" />
                  Buscar Mesas
                </Button>
              </Link>
              {user ? (
                <Link href="/campanhas/nova">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Wand2 className="h-5 w-5" />
                    Criar Campanha
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/sign-up">
                  <Button variant="outline" size="lg" className="gap-2">
                    Criar Conta Grátis
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-card/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
              Por que usar o FindMyRPG?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Busca Inteligente
              </h3>
              <p className="text-muted-foreground">
                Filtre por sistema, modalidade, temática e muito mais. Encontre
                exatamente o tipo de mesa que você procura.
              </p>
            </div>

            <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Comunidade Ativa
              </h3>
              <p className="text-muted-foreground">
                Conecte-se com jogadores e mestres apaixonados por RPG. Encontre
                grupos que compartilham seu estilo de jogo.
              </p>
            </div>

            <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Perfis Verificados
              </h3>
              <p className="text-muted-foreground">
                Ambiente seguro com perfis autenticados. Saiba com quem você está
                jogando antes de entrar em uma campanha.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl space-y-6">
            <Dice6 className="mx-auto h-12 w-12 text-primary" />
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
              Pronto para rolar os dados?
            </h2>
            <p className="text-muted-foreground">
              Junte-se a centenas de jogadores que já encontraram sua mesa ideal.
              Comece sua jornada épica hoje mesmo.
            </p>
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Ir para Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2">
                  Começar Agora
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FindMyRPG. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
