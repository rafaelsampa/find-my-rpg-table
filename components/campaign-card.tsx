import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CampaignWithOwner,
  sistemaLabels,
  modalidadeLabels,
  ferramentaLabels,
  tematicaLabels,
  tipoLabels,
} from "@/types/database";
import {
  Users,
  MapPin,
  Monitor,
  Sword,
  User,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface CampaignCardProps {
  campaign: CampaignWithOwner;
  showActions?: boolean;
  isOwner?: boolean;
}

export function CampaignCard({
  campaign,
  showActions = true,
  isOwner = false,
}: CampaignCardProps) {
  const vagasDisponiveis = campaign.vagas_totais - campaign.vagas_preenchidas;
  const createdAt = new Date(campaign.created_at).toLocaleDateString("pt-BR");

  return (
    <Card className="flex flex-col transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-balance">
            {campaign.titulo}
          </CardTitle>
          <Badge
            variant={vagasDisponiveis > 0 ? "default" : "secondary"}
            className="shrink-0"
          >
            {vagasDisponiveis > 0
              ? `${vagasDisponiveis} vaga${vagasDisponiveis > 1 ? "s" : ""}`
              : "Lotada"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-3">
          {campaign.historia_ambientacao}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            <Sword className="h-3 w-3" />
            {sistemaLabels[campaign.sistema]}
          </Badge>
          <Badge variant="outline" className="gap-1">
            {tematicaLabels[campaign.tematica]}
          </Badge>
          <Badge variant="accent" className="gap-1">
            {tipoLabels[campaign.tipo]}
          </Badge>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>
              {campaign.vagas_preenchidas}/{campaign.vagas_totais} jogadores
            </span>
          </div>
          <div className="flex items-center gap-2">
            {campaign.modalidade === "presencial" ? (
              <MapPin className="h-4 w-4 text-primary" />
            ) : (
              <Monitor className="h-4 w-4 text-primary" />
            )}
            <span>
              {modalidadeLabels[campaign.modalidade]}
              {campaign.cidade_estado && ` - ${campaign.cidade_estado}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-primary" />
            <span>{ferramentaLabels[campaign.ferramenta]}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span>{campaign.tem_gm ? "Com GM" : "Sem GM"}</span>
          </div>
        </div>

        {/* Owner & Date */}
        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {campaign.profiles?.nome_perfil || "Anônimo"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {createdAt}
          </span>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="gap-2">
          {isOwner ? (
            <>
              <Link href={`/campanhas/${campaign.id}/editar`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Editar
                </Button>
              </Link>
              <Link href={`/campanhas/${campaign.id}`} className="flex-1">
                <Button className="w-full">Ver Detalhes</Button>
              </Link>
            </>
          ) : (
            <Link href={`/campanhas/${campaign.id}`} className="w-full">
              <Button className="w-full" disabled={vagasDisponiveis === 0}>
                {vagasDisponiveis > 0 ? "Ver Mesa" : "Mesa Lotada"}
              </Button>
            </Link>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
