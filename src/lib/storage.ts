import type { UserProfile, Conversation, Exercise } from './types'

const KEYS = {
  profile: 'stoic_profile',
  conversations: 'stoic_conversations',
  exercises: 'stoic_exercises',
  apiKey: 'stoic_api_key',
  language: 'stoic_language',
  shownQuotes: 'stoic_shown_quotes',
  onboarded: 'stoic_onboarded',
}

function get<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function set(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export const storage = {
  getProfile: () => get<UserProfile>(KEYS.profile),
  setProfile: (p: UserProfile) => set(KEYS.profile, p),

  getConversations: () => get<Conversation[]>(KEYS.conversations) ?? [],
  saveConversation: (c: Conversation) => {
    const all = storage.getConversations()
    const idx = all.findIndex(x => x.id === c.id)
    if (idx >= 0) all[idx] = c; else all.push(c)
    set(KEYS.conversations, all)
  },

  getExercises: () => get<Exercise[]>(KEYS.exercises) ?? [],
  saveExercise: (e: Exercise) => {
    const all = storage.getExercises()
    const idx = all.findIndex(x => x.id === e.id)
    if (idx >= 0) all[idx] = e; else all.push(e)
    set(KEYS.exercises, all)
  },

  getApiKey: () => localStorage.getItem(KEYS.apiKey) ?? '',
  setApiKey: (k: string) => localStorage.setItem(KEYS.apiKey, k),

  getLanguage: () => localStorage.getItem(KEYS.language) ?? 'he',
  setLanguage: (l: string) => localStorage.setItem(KEYS.language, l),

  getShownQuotes: () => get<string[]>(KEYS.shownQuotes) ?? [],
  setShownQuotes: (ids: string[]) => set(KEYS.shownQuotes, ids),

  isOnboarded: () => localStorage.getItem(KEYS.onboarded) === 'true',
  setOnboarded: () => localStorage.setItem(KEYS.onboarded, 'true'),
}
