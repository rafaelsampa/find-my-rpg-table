import { Header } from "@/components/header";
import { CampaignForm } from "@/components/campaign-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NovaCampanhaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
            Criar Nova Campanha
          </h1>
          <p className="mt-2 text-muted-foreground">
            Preencha os detalhes da sua mesa de RPG
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <CampaignForm mode="create" />
        </div>
      </main>
    </div>
  );
}
