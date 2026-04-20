import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import {
  CampaignWithOwner,
  sistemaLabels,
  modalidadeLabels,
  ferramentaLabels,
  assetsLabels,
  tematicaLabels,
  tipoLabels,
} from "@/types/database";
import {
  ArrowLeft,
  Users,
  MapPin,
  Monitor,
  Sword,
  User,
  Calendar,
  Pencil,
  Trash2,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteCampaignButton } from "./delete-button";

export default async function CampanhaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*, profiles!campaigns_owner_id_fkey(*)")
    .eq("id", id)
    .single();

  if (!campaign) {
    notFound();
  }

  const typedCampaign = campaign as CampaignWithOwner;
  const isOwner = user?.id === typedCampaign.owner_id;
  const vagasDisponiveis =
    typedCampaign.vagas_totais - typedCampaign.vagas_preenchidas;
  const createdAt = new Date(typedCampaign.created_at).toLocaleDateString(
    "pt-BR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/buscar"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para busca
        </Link>

        <div className="rounded-xl border border-border bg-card">
          {/* Header */}
          <div className="border-b border-border p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={vagasDisponiveis > 0 ? "default" : "secondary"}
                  >
                    {vagasDisponiveis > 0
                      ? `${vagasDisponiveis} vaga${vagasDisponiveis > 1 ? "s" : ""} disponíve${vagasDisponiveis > 1 ? "is" : "l"}`
                      : "Mesa Lotada"}
                  </Badge>
                  <Badge variant="outline">
                    {sistemaLabels[typedCampaign.sistema]}
                  </Badge>
                  <Badge variant="accent">
                    {tipoLabels[typedCampaign.tipo]}
                  </Badge>
                </div>
                <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground sm:text-3xl text-balance">
                  {typedCampaign.titulo}
                </h1>
              </div>

              {isOwner && (
                <div className="flex gap-2">
                  <Link href={`/campanhas/${id}/editar`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                  <DeleteCampaignButton campaignId={id} />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="space-y-6 lg:col-span-2">
                <div>
                  <h2 className="mb-3 text-lg font-semibold text-foreground">
                    História e Ambientação
                  </h2>
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {typedCampaign.historia_ambientacao}
                  </p>
                </div>

                <div>
                  <h2 className="mb-3 text-lg font-semibold text-foreground">
                    Detalhes da Mesa
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4">
                      <Sword className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Sistema
                        </div>
                        <div className="font-medium text-foreground">
                          {sistemaLabels[typedCampaign.sistema]}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4">
                      <Monitor className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Ferramenta
                        </div>
                        <div className="font-medium text-foreground">
                          {ferramentaLabels[typedCampaign.ferramenta]}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4">
                      {typedCampaign.modalidade === "presencial" ? (
                        <MapPin className="h-5 w-5 text-primary" />
                      ) : (
                        <Monitor className="h-5 w-5 text-primary" />
                      )}
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Modalidade
                        </div>
                        <div className="font-medium text-foreground">
                          {modalidadeLabels[typedCampaign.modalidade]}
                          {typedCampaign.cidade_estado &&
                            ` - ${typedCampaign.cidade_estado}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4">
                      <Palette className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Assets Visuais
                        </div>
                        <div className="font-medium text-foreground">
                          {assetsLabels[typedCampaign.assets]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Vagas */}
                <div className="rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">Vagas</span>
                  </div>
                  <div className="mb-2 text-3xl font-bold text-primary">
                    {typedCampaign.vagas_preenchidas} /{" "}
                    {typedCampaign.vagas_totais}
                  </div>
                  <div className="mb-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${(typedCampaign.vagas_preenchidas / typedCampaign.vagas_totais) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {typedCampaign.tem_gm ? "Com GM" : "Sem GM (procurando)"} -{" "}
                    {tematicaLabels[typedCampaign.tematica]}
                  </div>
                </div>

                {/* Criador */}
                <div className="rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">
                      Criado por
                    </span>
                  </div>
                  <div className="font-medium text-foreground">
                    {typedCampaign.profiles?.nome_perfil || "Anônimo"}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {createdAt}
                  </div>
                </div>

                {/* CTA */}
                {!isOwner && vagasDisponiveis > 0 && (
                  <Button className="w-full" size="lg">
                    Solicitar Entrada
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
