import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  // Parâmetros de busca
  const q = searchParams.get("q") || "";
  const sistema = searchParams.get("sistema");
  const modalidade = searchParams.get("modalidade");
  const tematica = searchParams.get("tematica");
  const ferramenta = searchParams.get("ferramenta");
  const tipo = searchParams.get("tipo");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const offset = (page - 1) * limit;

  // Query base
  let query = supabase
    .from("campaigns")
    .select("*, profiles!campaigns_owner_id_fkey(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // Aplicar filtros
  if (q) {
    query = query.or(`titulo.ilike.%${q}%,historia_ambientacao.ilike.%${q}%`);
  }
  if (sistema) {
    const sistemas = sistema.split(",").filter(Boolean);
    if (sistemas.length > 0) {
      query = query.in("sistema", sistemas);
    }
  }
  if (modalidade) {
    const modalidades = modalidade.split(",").filter(Boolean);
    if (modalidades.length > 0) {
      query = query.in("modalidade", modalidades);
    }
  }
  if (tematica) {
    const tematicas = tematica.split(",").filter(Boolean);
    if (tematicas.length > 0) {
      query = query.in("tematica", tematicas);
    }
  }
  if (ferramenta) {
    const ferramentas = ferramenta.split(",").filter(Boolean);
    if (ferramentas.length > 0) {
      query = query.in("ferramenta", ferramentas);
    }
  }
  if (tipo) {
    const tipos = tipo.split(",").filter(Boolean);
    if (tipos.length > 0) {
      query = query.in("tipo", tipos);
    }
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    campaigns: data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validações
    if (!body.titulo || body.titulo.length < 5) {
      return NextResponse.json(
        { error: "Título deve ter pelo menos 5 caracteres" },
        { status: 400 }
      );
    }

    if (!body.historia_ambientacao || body.historia_ambientacao.length < 20) {
      return NextResponse.json(
        { error: "História deve ter pelo menos 20 caracteres" },
        { status: 400 }
      );
    }

    if (body.vagas_totais < 1 || body.vagas_totais > 20) {
      return NextResponse.json(
        { error: "Vagas devem estar entre 1 e 20" },
        { status: 400 }
      );
    }

    if (body.modalidade === "presencial" && !body.cidade_estado) {
      return NextResponse.json(
        { error: "Cidade/Estado é obrigatório para mesas presenciais" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        owner_id: user.id,
        titulo: body.titulo,
        historia_ambientacao: body.historia_ambientacao,
        vagas_totais: body.vagas_totais,
        vagas_preenchidas: body.vagas_preenchidas || 0,
        tem_gm: body.tem_gm ?? true,
        sistema: body.sistema,
        modalidade: body.modalidade,
        cidade_estado: body.cidade_estado || null,
        ferramenta: body.ferramenta,
        assets: body.assets,
        tematica: body.tematica,
        tipo: body.tipo,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Dados inválidos" },
      { status: 400 }
    );
  }
}
