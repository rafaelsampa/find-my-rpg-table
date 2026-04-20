import { Header } from "@/components/header";
import { CampaignCard } from "@/components/campaign-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { CampaignWithOwner } from "@/types/database";
import { Plus, Dice6 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Buscar campanhas do usuário
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*, profiles!campaigns_owner_id_fkey(*)")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  // Buscar perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
              Olá, {profile?.nome_perfil || user.email?.split("@")[0]}!
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie suas campanhas e encontre novos jogadores
            </p>
          </div>
          <Link href="/campanhas/nova">
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              Nova Campanha
            </Button>
          </Link>
        </div>

        {/* Campaigns List */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Suas Campanhas
          </h2>

          {campaigns && campaigns.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(campaigns as CampaignWithOwner[]).map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  isOwner={true}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
              <Dice6 className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Nenhuma campanha ainda
              </h3>
              <p className="mb-6 max-w-md text-muted-foreground">
                Crie sua primeira campanha e comece a reunir jogadores para
                aventuras épicas!
              </p>
              <Link href="/campanhas/nova">
                <Button className="gap-2">
                  <Plus className="h-5 w-5" />
                  Criar Primeira Campanha
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
