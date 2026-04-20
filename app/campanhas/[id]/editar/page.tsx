import { Header } from "@/components/header";
import { CampaignForm } from "@/components/campaign-form";
import { createClient } from "@/lib/supabase/server";
import { Campaign } from "@/types/database";
import { redirect, notFound } from "next/navigation";

export default async function EditarCampanhaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .single();

  if (!campaign) {
    notFound();
  }

  // Verificar se é o dono
  if (campaign.owner_id !== user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
            Editar Campanha
          </h1>
          <p className="mt-2 text-muted-foreground">
            Atualize os detalhes da sua mesa de RPG
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <CampaignForm campaign={campaign as Campaign} mode="edit" />
        </div>
      </main>
    </div>
  );
}
