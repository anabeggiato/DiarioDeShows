import { supabase } from '@/lib/supabase'

const SHOW_COVERS_BUCKET = 'show-covers'

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

export async function uploadShowCover(imageUri: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const response = await fetch(imageUri)
  const imageData = await response.arrayBuffer()
  const contentType = getContentType(imageUri)
  const extension = getFileExtension(contentType)
  const filePath = `${user.id}/${Date.now()}.${extension}`

  const { error } = await supabase.storage
    .from(SHOW_COVERS_BUCKET)
    .upload(filePath, imageData, {
      contentType,
      upsert: false,
    })

  if (error) {
    throw new Error(`Erro ao enviar capa do show: ${error.message}`)
  }

  const { data } = supabase.storage
    .from(SHOW_COVERS_BUCKET)
    .getPublicUrl(filePath)

  return data.publicUrl
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

  if (error) throw new Error(`Erro ao listar shows: ${error.message}`)

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

  if (error) throw new Error(`Erro ao criar show: ${error.message}`)

  return data
}

function getContentType(uri: string) {
  const normalizedUri = uri.toLowerCase()

  if (normalizedUri.endsWith('.png')) return 'image/png'
  if (normalizedUri.endsWith('.webp')) return 'image/webp'

  return 'image/jpeg'
}

function getFileExtension(contentType: string) {
  if (contentType === 'image/png') return 'png'
  if (contentType === 'image/webp') return 'webp'

  return 'jpg'
}
