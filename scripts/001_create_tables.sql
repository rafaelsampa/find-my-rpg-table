-- Tabela de perfis de usuários (referencia auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_perfil TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);
-- Permitir leitura pública dos perfis para exibir nos cards
CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT USING (true);

-- Enums para categorias fixas
CREATE TYPE sistema_rpg AS ENUM (
  'dnd_5e',
  'lancer',
  'tormenta20',
  'call_of_cthulhu',
  'pathfinder_2e',
  'vampiro_mascara',
  'outros'
);

CREATE TYPE modalidade AS ENUM (
  'remoto',
  'presencial'
);

CREATE TYPE ferramenta_vtt AS ENUM (
  'tabletop_simulator',
  'foundry_vtt',
  'roll20',
  'owlbear_rodeo',
  'discord_teatro_mente'
);

CREATE TYPE assets_visuais AS ENUM (
  'mapas_modulares',
  'tokens_digitais',
  'desenhos_mao',
  'sem_assets'
);

CREATE TYPE tematica AS ENUM (
  'fantasia_medieval',
  'scifi_mecha',
  'cyberpunk',
  'terror_investigacao',
  'pos_apocaliptico'
);

CREATE TYPE tipo_campanha AS ENUM (
  'modulo_pronto',
  'homebrew'
);

-- Tabela de campanhas
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  historia_ambientacao TEXT NOT NULL,
  vagas_totais INTEGER NOT NULL CHECK (vagas_totais > 0 AND vagas_totais <= 20),
  vagas_preenchidas INTEGER NOT NULL DEFAULT 0 CHECK (vagas_preenchidas >= 0),
  tem_gm BOOLEAN NOT NULL DEFAULT true,
  sistema sistema_rpg NOT NULL,
  modalidade modalidade NOT NULL,
  cidade_estado TEXT, -- Obrigatório se modalidade = 'presencial'
  ferramenta ferramenta_vtt NOT NULL,
  assets assets_visuais NOT NULL,
  tematica tematica NOT NULL,
  tipo tipo_campanha NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Constraint: vagas_preenchidas não pode ser maior que vagas_totais
  CONSTRAINT vagas_validas CHECK (vagas_preenchidas <= vagas_totais),
  -- Constraint: se modalidade for presencial, cidade_estado é obrigatório
  CONSTRAINT cidade_obrigatoria CHECK (
    modalidade != 'presencial' OR (modalidade = 'presencial' AND cidade_estado IS NOT NULL AND cidade_estado != '')
  )
);

-- Habilitar RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Policies para campaigns
-- Qualquer um pode ver campanhas (busca pública)
CREATE POLICY "campaigns_select_all" ON public.campaigns FOR SELECT USING (true);
-- Apenas o dono pode criar suas campanhas
CREATE POLICY "campaigns_insert_own" ON public.campaigns FOR INSERT WITH CHECK (auth.uid() = owner_id);
-- Apenas o dono pode atualizar suas campanhas
CREATE POLICY "campaigns_update_own" ON public.campaigns FOR UPDATE USING (auth.uid() = owner_id);
-- Apenas o dono pode deletar suas campanhas
CREATE POLICY "campaigns_delete_own" ON public.campaigns FOR DELETE USING (auth.uid() = owner_id);

-- Índices para otimizar buscas
CREATE INDEX IF NOT EXISTS idx_campaigns_sistema ON public.campaigns(sistema);
CREATE INDEX IF NOT EXISTS idx_campaigns_modalidade ON public.campaigns(modalidade);
CREATE INDEX IF NOT EXISTS idx_campaigns_tematica ON public.campaigns(tematica);
CREATE INDEX IF NOT EXISTS idx_campaigns_ferramenta ON public.campaigns(ferramenta);
CREATE INDEX IF NOT EXISTS idx_campaigns_owner ON public.campaigns(owner_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_created ON public.campaigns(created_at DESC);

-- Trigger para criar perfil automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_perfil, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'nome_perfil', split_part(new.email, '@', 1)),
    new.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
