export interface DailyReading {
  id: number
  title: string
  author: string
  englishTitle?: string
  englishAuthor?: string
  excerpt: { he: string; en: string }
  source: string
  englishSource?: string
  date?: string
}

export const dailyReadings: DailyReading[] = [
  {
    id: 1,
    title: 'על הדברים שבשליטתנו',
    author: 'אפיקטטוס',
    englishTitle: 'On Things Within Our Control',
    englishAuthor: 'Epictetus',
    excerpt: {
      he: 'יש דברים שבשליטתנו ויש דברים שאינם בשליטתנו. בשליטתנו: דעותינו, כמיהות, שנאות, רצויות — בקיצור, הכל שנובע מהמעשים שלנו. מחוץ לשליטתנו: גופנו, רכושנו, מוניטין, גופנו — בקיצור, הכל שאינו נובע מהמעשים שלנו.\n\nזה אומר שאתה לא יכול לשלוט בתוצאות של מעשיך, אלא רק במעשיך עצמם. אתה לא יכול לשלוט בתגובות של אנשים אחרים, אלא בתגובה שלך. אתה לא יכול לשלוט בגורל, אלא רק בתגובה שלך לגורל. זה הרעיון המרכזי של הסטואיות: עשה את מה שבכוחך ותן לכל שאר דברים להתרחש כמו שהם צריכים.',
      en: 'Some things are within our control and some things are not. Within our control: our opinions, desires, aversions, and judgments—in short, anything that is our own action. Outside our control: our body, property, reputation—in short, anything that is not our own action.\n\nThis means you cannot control the outcomes of your actions, only the actions themselves. You cannot control how others respond, only your own response. You cannot control fate, only your reaction to it. This is the central idea of Stoicism: do what is in your power and let everything else happen as it should.'
    },
    source: 'אנכיירידיון / Enchiridion',
    englishSource: 'Enchiridion',
  },
  {
    id: 2,
    title: 'עדות הנשמה',
    author: 'מרקוס אורליוס',
    englishTitle: 'On the Soul',
    englishAuthor: 'Marcus Aurelius',
    excerpt: {
      he: 'הנשמה שלך זה האדם האמיתי שלך. לא הגוף, לא הכסף, לא השם שלך. הנשמה היא הדבר היחיד שהוא שלך באמת, הדבר היחיד שלא יכול להילקח ממך.\n\nחכמה היא הידיעה מה לשמור ומה להניח. היא הקבלה שהחיים שלך לא מוגדרים על ידי עושר או כבוד חיצוני, אלא על ידי מצב הנשמה שלך. בן אדם טוב לא בן אדם עשיר, אלא בן אדם שעשה את הטוב, שנשמר נוגע לעקרונות שלו.',
      en: 'Your soul is the real you. Not your body, not your money, not your reputation. The soul is the only thing that is truly yours, the only thing that cannot be taken from you.\n\nWisdom is knowing what to keep and what to let go. It is the acceptance that your life is not defined by wealth or external honor, but by the state of your soul. A good person is not a rich person, but someone who has done what is right, who has maintained their principles.'
    },
    source: 'מחשבות לעצמי / Meditations',
    englishSource: 'Meditations',
  },
  {
    id: 3,
    title: 'על התמדה וסבלנות',
    author: 'סנקה',
    englishTitle: 'On Persistence and Patience',
    englishAuthor: 'Seneca',
    excerpt: {
      he: 'הסבלנות היא לא רק עמידה בקשיים — היא המושג של אף לא להראות חוסר סבלנות. זה אומר שאתה שומר על שלוות הנשמה שלך כל כך טובה שלא משהו חיצוני יכול לפגוע בה.\n\nכל דבר שקורה לך הוא הזדמנות להשתמש בזה כדי לעשות הטוב. אם מישהו גרם לך כאב, זו הזדמנות להראות רחמים. אם קיבלת הפסד כספי, זו הזדמנות להראות שאתה לא תלוי בעושר. הסבלנות היא לא רק להיות שקט — היא להיות חכם בתגובה שלך.',
      en: 'Patience is not just enduring difficulties — it is the concept of not even showing impatience. It means you keep your soul so peaceful that nothing external can disturb it.\n\nEverything that happens to you is an opportunity to do good. If someone hurt you, it\'s an opportunity to show compassion. If you suffered a financial loss, it\'s an opportunity to show you are not dependent on wealth. Patience is not just staying quiet — it\'s being wise in your response.'
    },
    source: 'מכתבים מוסריים אל לוציליוס / Moral Letters to Lucilius',
    englishSource: 'Moral Letters to Lucilius',
  },
]

export function getDailyReading(date?: Date): DailyReading {
  const d = date || new Date()
  const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)
  const index = dayOfYear % dailyReadings.length
  return dailyReadings[index]
}

export function getRandomReading(): DailyReading {
  const randomIndex = Math.floor(Math.random() * dailyReadings.length)
  return dailyReadings[randomIndex]
}
