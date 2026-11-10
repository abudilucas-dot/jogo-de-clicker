import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = url && key ? createClient(url, key) : null

export async function syncCloudSave(state: { totalPawsEarned: number; moonlight: number; unlockedHabitatIds: string[] }) {
  if (!supabase) return
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const progressScore = state.totalPawsEarned + state.moonlight * 100_000 + state.unlockedHabitatIds.length * 10_000
  await supabase.from('game_saves').upsert({ user_id: user.id, state, progress_score: progressScore, event_id: crypto.randomUUID() })
}

export async function loadLeaderboard() {
  if (!supabase) return []
  const { data } = await supabase.from('leaderboard').select('nickname, progress_score').order('progress_score', { ascending: false }).limit(20)
  return data ?? []
}
