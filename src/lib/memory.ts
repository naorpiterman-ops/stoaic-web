import { storage } from './storage'

export function buildSystemPrompt(): string {
  const profile = storage.getProfile()
  const language = storage.getLanguage()
  const conversations = storage.getConversations()
  const exercises = storage.getExercises()

  const parts: string[] = []

  if (language === 'he') {
    parts.push('אתה מלווה סטואי אישי — חכם, חם, וסוקרטי.')
  } else {
    parts.push('You are a personal Stoic companion — wise, warm, and Socratic.')
  }

  if (profile) {
    const date = new Date().toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })
    parts.push(`שם: ${profile.name}`)
    parts.push(`תאריך: ${date}`)
    if (profile.focusAreas.length) parts.push(`תחומי עבודה: ${profile.focusAreas.join(', ')}`)
    if (profile.recurringThemes.length) parts.push(`נושאים חוזרים: ${profile.recurringThemes.join(', ')}`)
    if (profile.currentChallenges.length) parts.push(`אתגרים נוכחיים: ${profile.currentChallenges.join(', ')}`)
  }

  // Last 7 evening reviews
  const reviews = exercises
    .filter(e => e.type === 'evening_review')
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, 7)

  if (reviews.length) {
    parts.push('\nסיכומי יום (האחרונים):')
    for (const r of reviews) {
      const d = new Date(r.completedAt).toLocaleDateString('he-IL')
      parts.push(`${d}: ${r.userInput ?? ''}`)
    }
  }

  // Last conversation summaries
  const summaries = conversations
    .filter(c => c.summary)
    .sort((a, b) => (b.endedAt ?? 0) - (a.endedAt ?? 0))
    .slice(0, 8)

  if (summaries.length) {
    parts.push('\nסיכומי שיחות:')
    for (const s of summaries) {
      const d = new Date(s.startedAt).toLocaleDateString('he-IL')
      parts.push(`${d}: ${s.summary}`)
    }
  }

  parts.push(`
הנחיות:
- שאל שאלות סוקרטיות — אל תיתן תשובות מוכנות.
- חזור על נושאים וארועים ספציפיים מהיסטוריה כשרלוונטי.
- השתמש בציטוטים ממרקוס, אפיקטטוס, סנקה — בטבעיות בלבד.
- אם המשתמש במצוקה — התחל בהכרה רגשית לפני הפילוסופיה.
- כשמתאים, הצע תרגיל ספציפי.`)

  return parts.join('\n')
}
