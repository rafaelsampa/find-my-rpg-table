"use client";

import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  sistemaLabels,
  modalidadeLabels,
  tematicaLabels,
  ferramentaLabels,
  tipoLabels,
} from "@/types/database";
import { Filter, X, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    sistema: searchParams.get("sistema") || "",
    modalidade: searchParams.get("modalidade") || "",
    tematica: searchParams.get("tematica") || "",
    ferramenta: searchParams.get("ferramenta") || "",
    tipo: searchParams.get("tipo") || "",
  });

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/buscar?${params.toString()}`);
  }, [filters, router]);

  const clearFilters = useCallback(() => {
    setFilters({
      q: "",
      sistema: "",
      modalidade: "",
      tematica: "",
      ferramenta: "",
      tipo: "",
    });
    router.push("/buscar");
  }, [router]);

  const hasActiveFilters = Object.values(filters).some((v) => v);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou descrição..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            className="pl-10"
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>
        <Button onClick={applyFilters}>Buscar</Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Select
              label="Sistema"
              placeholder="Todos os sistemas"
              options={toOptions(sistemaLabels)}
              value={filters.sistema}
              onChange={(e) =>
                setFilters({ ...filters, sistema: e.target.value })
              }
            />
            <Select
              label="Modalidade"
              placeholder="Todas as modalidades"
              options={toOptions(modalidadeLabels)}
              value={filters.modalidade}
              onChange={(e) =>
                setFilters({ ...filters, modalidade: e.target.value })
              }
            />
            <Select
              label="Temática"
              placeholder="Todas as temáticas"
              options={toOptions(tematicaLabels)}
              value={filters.tematica}
              onChange={(e) =>
                setFilters({ ...filters, tematica: e.target.value })
              }
            />
            <Select
              label="Ferramenta VTT"
              placeholder="Todas as ferramentas"
              options={toOptions(ferramentaLabels)}
              value={filters.ferramenta}
              onChange={(e) =>
                setFilters({ ...filters, ferramenta: e.target.value })
              }
            />
            <Select
              label="Tipo de Campanha"
              placeholder="Todos os tipos"
              options={toOptions(tipoLabels)}
              value={filters.tipo}
              onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
            <Button onClick={applyFilters}>Aplicar Filtros</Button>
          </div>
        </div>
      )}
    </div>
  );
}
