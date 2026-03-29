"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Campaign,
  sistemaLabels,
  modalidadeLabels,
  ferramentaLabels,
  assetsLabels,
  tematicaLabels,
  tipoLabels,
} from "@/types/database";
import { Loader2 } from "lucide-react";

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

interface CampaignFormProps {
  campaign?: Campaign;
  mode: "create" | "edit";
}

export function CampaignForm({ campaign, mode }: CampaignFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titulo: campaign?.titulo || "",
    historia_ambientacao: campaign?.historia_ambientacao || "",
    vagas_totais: campaign?.vagas_totais || 4,
    vagas_preenchidas: campaign?.vagas_preenchidas || 0,
    tem_gm: campaign?.tem_gm ?? true,
    sistema: campaign?.sistema || "",
    modalidade: campaign?.modalidade || "",
    cidade_estado: campaign?.cidade_estado || "",
    ferramenta: campaign?.ferramenta || "",
    assets: campaign?.assets || "",
    tematica: campaign?.tematica || "",
    tipo: campaign?.tipo || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url =
        mode === "create"
          ? "/api/campaigns"
          : `/api/campaigns/${campaign?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      console.log("[v0] Enviando para:", url, method);
      console.log("[v0] Dados:", formData);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("[v0] Status da resposta:", res.status);
      
      const data = await res.json();
      console.log("[v0] Dados da resposta:", data);

      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar campanha");
      }

      router.push(`/campanhas/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <Input
        label="Título da Campanha *"
        name="titulo"
        placeholder="Ex: A Maldição de Strahd - Sessão aos Sábados"
        value={formData.titulo}
        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
        required
      />

      <Textarea
        label="História e Ambientação *"
        name="historia_ambientacao"
        placeholder="Descreva a história, ambientação e o que os jogadores podem esperar..."
        value={formData.historia_ambientacao}
        onChange={(e) =>
          setFormData({ ...formData, historia_ambientacao: e.target.value })
        }
        required
        className="min-h-[150px]"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Select
          label="Sistema de RPG *"
          name="sistema"
          placeholder="Selecione o sistema"
          options={toOptions(sistemaLabels)}
          value={formData.sistema}
          onChange={(e) => setFormData({ ...formData, sistema: e.target.value })}
          required
        />

        <Select
          label="Temática *"
          name="tematica"
          placeholder="Selecione a temática"
          options={toOptions(tematicaLabels)}
          value={formData.tematica}
          onChange={(e) =>
            setFormData({ ...formData, tematica: e.target.value })
          }
          required
        />

        <Select
          label="Tipo de Campanha *"
          name="tipo"
          placeholder="Selecione o tipo"
          options={toOptions(tipoLabels)}
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Vagas Totais *"
          name="vagas_totais"
          type="number"
          min={1}
          max={20}
          value={formData.vagas_totais}
          onChange={(e) =>
            setFormData({ ...formData, vagas_totais: parseInt(e.target.value) })
          }
          required
        />

        <Input
          label="Vagas já Preenchidas"
          name="vagas_preenchidas"
          type="number"
          min={0}
          max={formData.vagas_totais}
          value={formData.vagas_preenchidas}
          onChange={(e) =>
            setFormData({
              ...formData,
              vagas_preenchidas: parseInt(e.target.value),
            })
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Modalidade *"
          name="modalidade"
          placeholder="Selecione a modalidade"
          options={toOptions(modalidadeLabels)}
          value={formData.modalidade}
          onChange={(e) =>
            setFormData({ ...formData, modalidade: e.target.value })
          }
          required
        />

        {formData.modalidade === "presencial" && (
          <Input
            label="Cidade/Estado *"
            name="cidade_estado"
            placeholder="Ex: São Paulo, SP"
            value={formData.cidade_estado}
            onChange={(e) =>
              setFormData({ ...formData, cidade_estado: e.target.value })
            }
            required
          />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Ferramenta VTT *"
          name="ferramenta"
          placeholder="Selecione a ferramenta"
          options={toOptions(ferramentaLabels)}
          value={formData.ferramenta}
          onChange={(e) =>
            setFormData({ ...formData, ferramenta: e.target.value })
          }
          required
        />

        <Select
          label="Assets Visuais *"
          name="assets"
          placeholder="Selecione os assets"
          options={toOptions(assetsLabels)}
          value={formData.assets}
          onChange={(e) => setFormData({ ...formData, assets: e.target.value })}
          required
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="tem_gm"
          checked={formData.tem_gm}
          onChange={(e) => setFormData({ ...formData, tem_gm: e.target.checked })}
          className="h-4 w-4 rounded border-border bg-input text-primary focus:ring-primary"
        />
        <label htmlFor="tem_gm" className="text-sm font-medium text-foreground">
          Esta mesa já possui um GM/Mestre
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Criar Campanha" : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
