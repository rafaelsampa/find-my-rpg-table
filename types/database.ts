// Enums que correspondem aos tipos do banco
export type SistemaRPG =
  | "dnd_5e"
  | "lancer"
  | "tormenta20"
  | "call_of_cthulhu"
  | "pathfinder_2e"
  | "vampiro_mascara"
  | "outros";

export type Modalidade = "remoto" | "presencial";

export type FerramentaVTT =
  | "tabletop_simulator"
  | "foundry_vtt"
  | "roll20"
  | "owlbear_rodeo"
  | "discord_teatro_mente";

export type AssetsVisuais =
  | "mapas_modulares"
  | "tokens_digitais"
  | "desenhos_mao"
  | "sem_assets";

export type Tematica =
  | "fantasia_medieval"
  | "scifi_mecha"
  | "cyberpunk"
  | "terror_investigacao"
  | "pos_apocaliptico";

export type TipoCampanha = "modulo_pronto" | "homebrew";

// Types do banco
export interface Profile {
  id: string;
  nome_perfil: string;
  email: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  owner_id: string;
  titulo: string;
  historia_ambientacao: string;
  vagas_totais: number;
  vagas_preenchidas: number;
  tem_gm: boolean;
  sistema: SistemaRPG;
  modalidade: Modalidade;
  cidade_estado: string | null;
  ferramenta: FerramentaVTT;
  assets: AssetsVisuais;
  tematica: Tematica;
  tipo: TipoCampanha;
  created_at: string;
  updated_at: string;
}

export interface CampaignWithOwner extends Campaign {
  profiles: Profile;
}

// Labels para exibição
export const sistemaLabels: Record<SistemaRPG, string> = {
  dnd_5e: "D&D 5e",
  lancer: "Lancer",
  tormenta20: "Tormenta 20",
  call_of_cthulhu: "Call of Cthulhu",
  pathfinder_2e: "Pathfinder 2e",
  vampiro_mascara: "Vampiro: A Máscara",
  outros: "Outros",
};

export const modalidadeLabels: Record<Modalidade, string> = {
  remoto: "Remoto",
  presencial: "Presencial",
};

export const ferramentaLabels: Record<FerramentaVTT, string> = {
  tabletop_simulator: "Tabletop Simulator",
  foundry_vtt: "Foundry VTT",
  roll20: "Roll20",
  owlbear_rodeo: "Owlbear Rodeo",
  discord_teatro_mente: "Discord (Teatro da Mente)",
};

export const assetsLabels: Record<AssetsVisuais, string> = {
  mapas_modulares: "Mapas Modulares",
  tokens_digitais: "Tokens Digitais",
  desenhos_mao: "Desenhos à Mão",
  sem_assets: "Sem Assets Visuais",
};

export const tematicaLabels: Record<Tematica, string> = {
  fantasia_medieval: "Fantasia Medieval",
  scifi_mecha: "Sci-Fi / Mecha",
  cyberpunk: "Cyberpunk",
  terror_investigacao: "Terror / Investigação",
  pos_apocaliptico: "Pós-Apocalíptico",
};

export const tipoLabels: Record<TipoCampanha, string> = {
  modulo_pronto: "Módulo Pronto",
  homebrew: "Homebrew",
};
