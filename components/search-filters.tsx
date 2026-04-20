"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  sistemaLabels,
  modalidadeLabels,
  tematicaLabels,
  ferramentaLabels,
  tipoLabels,
} from "@/types/database";
import { Filter, X, Search, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span className={selected.length === 0 ? "text-muted-foreground" : ""}>
          {selected.length === 0
            ? `Selecionar ${label.toLowerCase()}`
            : `${selected.length} selecionado${selected.length > 1 ? "s" : ""}`}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-card shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                selected.includes(option.value)
                  ? "bg-primary/10 text-primary"
                  : "text-foreground"
              }`}
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded border ${
                  selected.includes(option.value)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground"
                }`}
              >
                {selected.includes(option.value) && (
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const toOptions = (labels: Record<string, string>): FilterOption[] =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const allLabels: Record<string, Record<string, string>> = {
  sistema: sistemaLabels,
  modalidade: modalidadeLabels,
  tematica: tematicaLabels,
  ferramenta: ferramentaLabels,
  tipo: tipoLabels,
};

const filterNames: Record<string, string> = {
  sistema: "Sistema",
  modalidade: "Modalidade",
  tematica: "Temática",
  ferramenta: "Ferramenta",
  tipo: "Tipo",
};

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const parseMultiple = (param: string | null): string[] => {
    if (!param) return [];
    return param.split(",").filter(Boolean);
  };

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    sistema: parseMultiple(searchParams.get("sistema")),
    modalidade: parseMultiple(searchParams.get("modalidade")),
    tematica: parseMultiple(searchParams.get("tematica")),
    ferramenta: parseMultiple(searchParams.get("ferramenta")),
    tipo: parseMultiple(searchParams.get("tipo")),
  });

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.sistema.length) params.set("sistema", filters.sistema.join(","));
    if (filters.modalidade.length) params.set("modalidade", filters.modalidade.join(","));
    if (filters.tematica.length) params.set("tematica", filters.tematica.join(","));
    if (filters.ferramenta.length) params.set("ferramenta", filters.ferramenta.join(","));
    if (filters.tipo.length) params.set("tipo", filters.tipo.join(","));
    router.push(`/buscar?${params.toString()}`);
  }, [filters, router]);

  const clearFilters = useCallback(() => {
    setFilters({
      q: "",
      sistema: [],
      modalidade: [],
      tematica: [],
      ferramenta: [],
      tipo: [],
    });
    router.push("/buscar");
  }, [router]);

  const removeFilter = (category: keyof typeof filters, value: string) => {
    if (category === "q") {
      setFilters({ ...filters, q: "" });
    } else {
      setFilters({
        ...filters,
        [category]: (filters[category] as string[]).filter((v) => v !== value),
      });
    }
  };

  // Collect all active tags
  const activeTags: { category: string; value: string; label: string }[] = [];
  
  (["sistema", "modalidade", "tematica", "ferramenta", "tipo"] as const).forEach(
    (category) => {
      filters[category].forEach((value) => {
        activeTags.push({
          category,
          value,
          label: allLabels[category][value] || value,
        });
      });
    }
  );

  const hasActiveFilters = filters.q || activeTags.length > 0;

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
          {activeTags.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeTags.length}
            </span>
          )}
        </Button>
      </div>

      {/* Active Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {filters.q && (
            <Badge
              variant="secondary"
              className="gap-1 bg-primary/20 text-primary hover:bg-primary/30"
            >
              Busca: {filters.q}
              <button
                onClick={() => removeFilter("q", "")}
                className="ml-1 rounded-full hover:bg-primary/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {activeTags.map((tag) => (
            <Badge
              key={`${tag.category}-${tag.value}`}
              variant="secondary"
              className="gap-1 bg-primary/20 text-primary hover:bg-primary/30"
            >
              <span className="text-primary/70">{filterNames[tag.category]}:</span>{" "}
              {tag.label}
              <button
                onClick={() => removeFilter(tag.category as keyof typeof filters, tag.value)}
                className="ml-1 rounded-full hover:bg-primary/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-6 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Limpar todos
          </Button>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MultiSelect
              label="Sistema"
              options={toOptions(sistemaLabels)}
              selected={filters.sistema}
              onChange={(values) => setFilters({ ...filters, sistema: values })}
            />
            <MultiSelect
              label="Modalidade"
              options={toOptions(modalidadeLabels)}
              selected={filters.modalidade}
              onChange={(values) => setFilters({ ...filters, modalidade: values })}
            />
            <MultiSelect
              label="Temática"
              options={toOptions(tematicaLabels)}
              selected={filters.tematica}
              onChange={(values) => setFilters({ ...filters, tematica: values })}
            />
            <MultiSelect
              label="Ferramenta VTT"
              options={toOptions(ferramentaLabels)}
              selected={filters.ferramenta}
              onChange={(values) => setFilters({ ...filters, ferramenta: values })}
            />
            <MultiSelect
              label="Tipo de Campanha"
              options={toOptions(tipoLabels)}
              selected={filters.tipo}
              onChange={(values) => setFilters({ ...filters, tipo: values })}
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
