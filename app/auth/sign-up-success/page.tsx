import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dice6, Mail, ArrowRight } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <Dice6 className="h-10 w-10 text-primary" />
          <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-primary">
            FindMyRPG
          </span>
        </Link>

        <div className="rounded-xl border border-border bg-card p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          <h1 className="mb-2 text-2xl font-bold text-foreground">
            Verifique seu email
          </h1>

          <p className="mb-6 text-muted-foreground">
            Enviamos um link de confirmação para o seu email. Clique no link
            para ativar sua conta e começar a jogar!
          </p>

          <div className="space-y-3">
            <Link href="/auth/login">
              <Button className="w-full gap-2">
                Ir para Login
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/">
              <Button variant="outline" className="w-full">
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Não recebeu o email? Verifique sua pasta de spam.
        </p>
      </div>
    </div>
  );
}
