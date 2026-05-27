import type { StoicQuote } from './types'
import { storage } from './storage'

const quotes: StoicQuote[] = [
  { id: 'ma-001', author: 'מרקוס אורליוס', source: 'מחשבות לעצמי', englishAuthor: 'Marcus Aurelius', englishSource: 'Meditations', book: 5, chapter: 8, hebrewText: 'אתה שולט על מחשבותיך — לא על האירועים החיצוניים. הכר בכך, ותמצא כוח.', englishText: 'You have control over your thoughts—not external events. Recognize this, and find strength.', tags: ['control'], mood: ['anxious', 'overwhelmed'], themes: ['dichotomy_of_control'], depth: 'entry' },
  { id: 'ma-002', author: 'מרקוס אורליוס', source: 'מחשבות לעצמי', englishAuthor: 'Marcus Aurelius', englishSource: 'Meditations', book: 2, chapter: 1, hebrewText: 'בבוקר, כשאתה קם בקושי, תזכיר לעצמך: אני קם לעבודת אדם.', englishText: 'In the morning, when you rise with reluctance, remind yourself: I rise for the work of a human being.', tags: ['discipline', 'morning'], mood: ['tired'], themes: ['duty'], depth: 'entry' },
  { id: 'ep-001', author: 'אפיקטטוס', source: 'אנקיריון', englishAuthor: 'Epictetus', englishSource: 'Enchiridion', chapter: 1, hebrewText: 'יש דברים שבכוחנו, ויש דברים שאינם. בכוחנו: דעות, דחפים, רצונות. לא בכוחנו: גוף, מוניטין, שלטון.', englishText: 'Some things are within our control, others are not. Within our control: beliefs, impulses, desires. Not within our control: body, reputation, power.', tags: ['control', 'freedom'], mood: ['frustrated', 'angry'], themes: ['dichotomy_of_control'], depth: 'entry' },
  { id: 'ep-002', author: 'אפיקטטוס', source: 'שיחות', englishAuthor: 'Epictetus', englishSource: 'Discourses', book: 1, chapter: 2, hebrewText: 'לא האירועים מטרידים אותנו, אלא הדעות שלנו על האירועים.', englishText: 'It is not things that disturb us, but our opinions about them.', tags: ['perception'], mood: ['anxious', 'upset'], themes: ['perception'], depth: 'entry' },
  { id: 'se-001', author: 'סנקה', source: 'מכתבות', englishAuthor: 'Seneca', englishSource: 'Moral Letters', chapter: 1, hebrewText: 'הפסד זמן הוא הפסד הגדול ביותר, כי אי אפשר להחזירו.', englishText: 'The loss of time is the greatest loss, because it cannot be restored.', tags: ['time'], mood: ['procrastinating'], themes: ['time'], depth: 'entry' },
  { id: 'se-002', author: 'סנקה', source: 'על שלוות הנפש', englishAuthor: 'Seneca', englishSource: 'On the Happy Life', hebrewText: 'אין מהירות בדרך לאשרה; לנסוע היטב חשוב יותר מלנסוע מהר.', englishText: 'There is no rush on the path to happiness; traveling well matters more than traveling fast.', tags: ['equanimity'], mood: ['rushed'], themes: ['equanimity'], depth: 'intermediate' },
  { id: 'ma-003', author: 'מרקוס אורליוס', source: 'מחשבות לעצמי', englishAuthor: 'Marcus Aurelius', englishSource: 'Meditations', book: 6, chapter: 2, hebrewText: 'מכשול לפעולה מקדם פעולה. מה שעומד בדרך הופך לדרך.', englishText: 'An obstacle to action becomes the action itself. What blocks the way becomes the way.', tags: ['obstacle', 'resilience'], mood: ['stuck', 'frustrated'], themes: ['resilience'], depth: 'intermediate' },
  { id: 'ep-003', author: 'אפיקטטוס', source: 'אנקיריון', englishAuthor: 'Epictetus', englishSource: 'Enchiridion', chapter: 5, hebrewText: 'אל תבקש שהאירועים יקרו כרצונך, אלא רצה שיקרו כפי שהם קורים, ותמצא שלווה.', englishText: 'Do not demand that events happen as you wish, but wish them to happen as they do, and you will find peace.', tags: ['acceptance'], mood: ['resistant', 'angry'], themes: ['amor_fati'], depth: 'entry' },
  { id: 'ma-004', author: 'מרקוס אורליוס', source: 'מחשבות לעצמי', englishAuthor: 'Marcus Aurelius', englishSource: 'Meditations', book: 4, chapter: 3, hebrewText: 'אל תבזבז את שארית חייך בחשיבה על אחרים. הסתכל פנימה.', englishText: 'Do not waste your remaining years thinking of others. Look inward.', tags: ['focus'], mood: ['distracted'], themes: ['inner_life'], depth: 'entry' },
  { id: 'se-003', author: 'סנקה', source: 'על קצרות החיים', englishAuthor: 'Seneca', englishSource: 'On the Shortness of Life', hebrewText: 'החיים אינם קצרים; אנחנו מבזבזים חלק גדול מהם.', englishText: 'Life is not short; we waste much of it.', tags: ['time', 'purpose'], mood: ['purposeless'], themes: ['time'], depth: 'entry' },
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
