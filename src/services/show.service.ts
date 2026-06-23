import { supabase } from '@/lib/supabase'

export type Show = {
  id: string
  artista: string
  data: string
  local: string
  companhias?: string | null
  depoimento?: string | null
  setlist?: string | null
  capa?: string | null
}

export type ShowPayload = {
  artista: string
  data: string
  local: string
  companhias?: string
  depoimento?: string
  setlist?: string
  capa?: string
}

export async function listShows() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .from('shows')
    .select('id, artista, data, local, companhias, depoimento, setlist, capa')
    .eq('user_id', user.id)
    .order('data', { ascending: false })

  if (error) throw error

  return data as Show[]
}

export async function createShow(show: ShowPayload) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .from('shows')
    .insert({
      user_id: user.id,
      ...show,
    })
    .select()
    .single()

  if (error) throw error

  return data
}
