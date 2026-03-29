import { Suspense } from "react";
import { Header } from "@/components/header";
import { SearchFilters } from "@/components/search-filters";
import { CampaignCard } from "@/components/campaign-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { CampaignWithOwner } from "@/types/database";
import { ChevronLeft, ChevronRight, Frown } from "lucide-react";
import Link from "next/link";

interface SearchParams {
  q?: string;
  sistema?: string;
  modalidade?: string;
  tematica?: string;
  ferramenta?: string;
  tipo?: string;
  page?: string;
}

async function CampaignResults({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("campaigns")
    .select("*, profiles!campaigns_owner_id_fkey(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (searchParams.q) {
    query = query.or(
      `titulo.ilike.%${searchParams.q}%,historia_ambientacao.ilike.%${searchParams.q}%`
    );
  }
  if (searchParams.sistema) {
    query = query.eq("sistema", searchParams.sistema);
  }
  if (searchParams.modalidade) {
    query = query.eq("modalidade", searchParams.modalidade);
  }
  if (searchParams.tematica) {
    query = query.eq("tematica", searchParams.tematica);
  }
  if (searchParams.ferramenta) {
    query = query.eq("ferramenta", searchParams.ferramenta);
  }
  if (searchParams.tipo) {
    query = query.eq("tipo", searchParams.tipo);
  }

  const { data: campaigns, count } = await query;
  const totalPages = Math.ceil((count || 0) / limit);

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Frown className="mb-4 h-16 w-16 text-muted-foreground" />
        <h3 className="mb-2 text-xl font-semibold text-foreground">
          Nenhuma mesa encontrada
        </h3>
        <p className="mb-6 text-muted-foreground">
          Tente ajustar os filtros ou buscar por outros termos.
        </p>
        <Link href="/buscar">
          <Button variant="outline">Limpar Filtros</Button>
        </Link>
      </div>
    );
  }

  // Build pagination links preserving filters
  const buildPageLink = (targetPage: number) => {
    const params = new URLSearchParams();
    if (searchParams.q) params.set("q", searchParams.q);
    if (searchParams.sistema) params.set("sistema", searchParams.sistema);
    if (searchParams.modalidade) params.set("modalidade", searchParams.modalidade);
    if (searchParams.tematica) params.set("tematica", searchParams.tematica);
    if (searchParams.ferramenta) params.set("ferramenta", searchParams.ferramenta);
    if (searchParams.tipo) params.set("tipo", searchParams.tipo);
    params.set("page", targetPage.toString());
    return `/buscar?${params.toString()}`;
  };

  return (
    <>
      <div className="mb-6 text-sm text-muted-foreground">
        Encontradas {count} mesa{count !== 1 ? "s" : ""}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(campaigns as CampaignWithOwner[]).map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link href={buildPageLink(page - 1)}>
              <Button variant="outline" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
            </Link>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <Link key={pageNum} href={buildPageLink(pageNum)}>
                  <Button
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                </Link>
              );
            })}
          </div>

          {page < totalPages && (
            <Link href={buildPageLink(page + 1)}>
              <Button variant="outline" size="sm" className="gap-1">
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default async function BuscarPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
            Buscar Mesas de RPG
          </h1>
          <p className="mt-2 text-muted-foreground">
            Encontre a campanha perfeita para você
          </p>
        </div>

        <Suspense fallback={<div>Carregando filtros...</div>}>
          <SearchFilters />
        </Suspense>

        <div className="mt-8">
          <Suspense
            fallback={
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-xl bg-card"
                  />
                ))}
              </div>
            }
          >
            <CampaignResults searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
