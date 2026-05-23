import type { StoicQuote } from './types'
import { storage } from './storage'

const quotes: StoicQuote[] = [
  { id: 'ma-001', author: 'מרקוס אורליוס', source: 'מחשבות לעצמי', book: 5, chapter: 8, hebrewText: 'אתה שולט על מחשבותיך — לא על האירועים החיצוניים. הכר בכך, ותמצא כוח.', tags: ['control'], mood: ['anxious', 'overwhelmed'], themes: ['dichotomy_of_control'], depth: 'entry' },
  { id: 'ma-002', author: 'מרקוס אורליוס', source: 'מחשבות לעצמי', book: 2, chapter: 1, hebrewText: 'בבוקר, כשאתה קם בקושי, תזכיר לעצמך: אני קם לעבודת אדם.', tags: ['discipline', 'morning'], mood: ['tired'], themes: ['duty'], depth: 'entry' },
  { id: 'ep-001', author: 'אפיקטטוס', source: 'אנקיריון', chapter: 1, hebrewText: 'יש דברים שבכוחנו, ויש דברים שאינם. בכוחנו: דעות, דחפים, רצונות. לא בכוחנו: גוף, מוניטין, שלטון.', tags: ['control', 'freedom'], mood: ['frustrated', 'angry'], themes: ['dichotomy_of_control'], depth: 'entry' },
  { id: 'ep-002', author: 'אפיקטטוס', source: 'שיחות', book: 1, chapter: 2, hebrewText: 'לא האירועים מטרידים אותנו, אלא הדעות שלנו על האירועים.', tags: ['perception'], mood: ['anxious', 'upset'], themes: ['perception'], depth: 'entry' },
  { id: 'se-001', author: 'סנקה', source: 'מכתבות', chapter: 1, hebrewText: 'הפסד זמן הוא הפסד הגדול ביותר, כי אי אפשר להחזירו.', tags: ['time'], mood: ['procrastinating'], themes: ['time'], depth: 'entry' },
  { id: 'se-002', author: 'סנקה', source: 'על שלוות הנפש', hebrewText: 'אין מהירות בדרך לאשרה; לנסוע היטב חשוב יותר מלנסוע מהר.', tags: ['equanimity'], mood: ['rushed'], themes: ['equanimity'], depth: 'intermediate' },
  { id: 'ma-003', author: 'מרקוס אורליוס', source: 'מחשבות לעצמי', book: 6, chapter: 2, hebrewText: 'מכשול לפעולה מקדם פעולה. מה שעומד בדרך הופך לדרך.', tags: ['obstacle', 'resilience'], mood: ['stuck', 'frustrated'], themes: ['resilience'], depth: 'intermediate' },
  { id: 'ep-003', author: 'אפיקטטוס', source: 'אנקיריון', chapter: 5, hebrewText: 'אל תבקש שהאירועים יקרו כרצונך, אלא רצה שיקרו כפי שהם קורים, ותמצא שלווה.', tags: ['acceptance'], mood: ['resistant', 'angry'], themes: ['amor_fati'], depth: 'entry' },
  { id: 'ma-004', author: 'מרקוס אורליוס', source: 'מחשבות לעצמי', book: 4, chapter: 3, hebrewText: 'אל תבזבז את שארית חייך בחשיבה על אחרים. הסתכל פנימה.', tags: ['focus'], mood: ['distracted'], themes: ['inner_life'], depth: 'entry' },
  { id: 'se-003', author: 'סנקה', source: 'על קצרות החיים', hebrewText: 'החיים אינם קצרים; אנחנו מבזבזים חלק גדול מהם.', tags: ['time', 'purpose'], mood: ['purposeless'], themes: ['time'], depth: 'entry' },
]

export function getDailyQuote(mood?: string): StoicQuote {
  let shown = storage.getShownQuotes()
  let pool = quotes.filter(q => !shown.includes(q.id))
  if (pool.length === 0) { shown = []; pool = quotes }

  let candidate = pool.find(q => mood && q.mood.includes(mood)) ?? pool[Math.floor(Math.random() * pool.length)]

  shown = [...shown, candidate.id].slice(-30)
  storage.setShownQuotes(shown)
  return candidate
}
