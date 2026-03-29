import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .select("*, profiles!campaigns_owner_id_fkey(*)")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Verificar se o usuário é dono da campanha
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("owner_id")
    .eq("id", id)
    .single();

  if (!campaign || campaign.owner_id !== user.id) {
    return NextResponse.json(
      { error: "Você não tem permissão para editar esta campanha" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    // Validações
    if (body.titulo && body.titulo.length < 5) {
      return NextResponse.json(
        { error: "Título deve ter pelo menos 5 caracteres" },
        { status: 400 }
      );
    }

    if (body.historia_ambientacao && body.historia_ambientacao.length < 20) {
      return NextResponse.json(
        { error: "História deve ter pelo menos 20 caracteres" },
        { status: 400 }
      );
    }

    if (body.vagas_totais && (body.vagas_totais < 1 || body.vagas_totais > 20)) {
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
      .update({
        titulo: body.titulo,
        historia_ambientacao: body.historia_ambientacao,
        vagas_totais: body.vagas_totais,
        vagas_preenchidas: body.vagas_preenchidas,
        tem_gm: body.tem_gm,
        sistema: body.sistema,
        modalidade: body.modalidade,
        cidade_estado: body.cidade_estado || null,
        ferramenta: body.ferramenta,
        assets: body.assets,
        tematica: body.tematica,
        tipo: body.tipo,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Dados inválidos" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Verificar se o usuário é dono da campanha
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("owner_id")
    .eq("id", id)
    .single();

  if (!campaign || campaign.owner_id !== user.id) {
    return NextResponse.json(
      { error: "Você não tem permissão para excluir esta campanha" },
      { status: 403 }
    );
  }

  const { error } = await supabase.from("campaigns").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
