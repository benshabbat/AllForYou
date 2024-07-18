const allergenSeedData = [
  {
    name: "Milk",
    hebrewName: "חלב",
    icon: "🥛",
    description: "אלרגיה לחלב פרה היא אחת האלרגיות הנפוצות ביותר, במיוחד אצל תינוקות וילדים.",
    symptoms: ["פריחה", "בחילות", "כאבי בטן", "שלשולים"],
    avoidList: ["חלב", "גבינה", "יוגורט", "חמאה"],
    alternatives: [
      { name: "משקה סויה", description: "תחליף צמחי לחלב" },
      { name: "משקה שקדים", description: "תחליף צמחי נוסף לחלב" },
      { name: "משקה אורז", description: "אפשרות נוספת לתחליף חלב" }
    ],
    severity: "Medium"
  },
  {
    name: "Eggs",
    hebrewName: "ביצים",
    icon: "🥚",
    description: "אלרגיה לביצים היא נפוצה מאוד ויכולה לגרום לתגובות מיידיות.",
    symptoms: ["פריחה", "בחילות", "קשיי נשימה"],
    avoidList: ["ביצים", "מאפים המכילים ביצים", "מיונז"],
    alternatives: [
      { name: "תחליפי ביצה מסחריים", description: "מוצרים מיוחדים להחלפת ביצים במתכונים" },
      { name: "בננה מעוכה", description: "יכולה לשמש כתחליף לביצים בחלק מהמתכונים" },
      { name: "זרעי פשתן טחונים", description: "מעורבבים עם מים יכולים להחליף ביצים" }
    ],
    severity: "High"
  },
  {
    name: "Peanuts",
    hebrewName: "בוטנים",
    icon: "🥜",
    description: "אלרגיה לבוטנים היא אחת האלרגיות המסוכנות ביותר ויכולה לגרום לתגובות חמורות.",
    symptoms: ["נפיחות בפה", "קשיי נשימה", "אנפילקסיס"],
    avoidList: ["בוטנים", "חמאת בוטנים", "שמן בוטנים"],
    alternatives: [
      { name: "טחינה", description: "ממרח על בסיס שומשום" },
      { name: "חמאת שקדים", description: "ממרח על בסיס שקדים" },
      { name: "חמאת גרעיני דלעת", description: "ממרח על בסיס גרעיני דלעת" }
    ],
    severity: "High"
  },
  {
    name: "Tree Nuts",
    hebrewName: "אגוזי עץ",
    icon: "🌰",
    description: "אלרגיה לאגוזי עץ יכולה להיות חמורה ולעיתים קרובות נמשכת לאורך כל החיים.",
    symptoms: ["נפיחות בגרון", "קשיי נשימה", "פריחה"],
    avoidList: ["שקדים", "אגוזי מלך", "אגוזי לוז", "אגוזי קשיו"],
    alternatives: [
      { name: "זרעי דלעת", description: "מקור טוב לחלבון ושומנים בריאים" },
      { name: "זרעי חמניות", description: "יכולים להחליף אגוזים בחלק מהמתכונים" },
      { name: "אבוקדו", description: "מקור טוב לשומנים בריאים" }
    ],
    severity: "High"
  },
  {
    name: "Fish",
    hebrewName: "דגים",
    icon: "🐟",
    description: "אלרגיה לדגים היא בדרך כלל אלרגיה לכל סוגי הדגים ויכולה להיות חמורה.",
    symptoms: ["בחילות", "כאבי בטן", "קשיי נשימה"],
    avoidList: ["כל סוגי הדגים", "רוטב דגים", "סושי"],
    alternatives: [
      { name: "טופו", description: "מקור צמחי לחלבון" },
      { name: "עדשים", description: "מקור טוב לחלבון וברזל" },
      { name: "קטניות", description: "מקור נוסף לחלבון צמחי" }
    ],
    severity: "High"
  },
  {
    name: "Soy",
    hebrewName: "סויה",
    icon: "🫘",
    description: "אלרגיה לסויה היא נפוצה יותר אצל תינוקות וילדים, אך יכולה להופיע גם אצל מבוגרים.",
    symptoms: ["פריחה", "בחילות", "קשיי נשימה"],
    avoidList: ["טופו", "חלב סויה", "רוטב סויה"],
    alternatives: [
      { name: "משקאות צמחיים אחרים", description: "כמו משקה שקדים או אורז" },
      { name: "חלבון אפונה", description: "מקור חלבון חלופי" },
      { name: "קטניות אחרות", description: "כמו עדשים או שעועית" }
    ],
    severity: "Medium"
  },
  {
    name: "Wheat",
    hebrewName: "חיטה",
    icon: "🌾",
    description: "אלרגיה לחיטה שונה מצליאק ויכולה לגרום לתגובות מיידיות.",
    symptoms: ["כאבי בטן", "שלשולים", "פריחה"],
    avoidList: ["לחם", "פסטה", "עוגות מקמח חיטה"],
    alternatives: [
      { name: "קמח אורז", description: "חלופה נפוצה לקמח חיטה" },
      { name: "קמח תירס", description: "משמש להכנת מאפים ללא גלוטן" },
      { name: "קמח קוקוס", description: "חלופה דלת פחמימות לקמח חיטה" }
    ],
    severity: "Medium"
  },
  {
    name: "Sesame",
    hebrewName: "שומשום",
    icon: "🌱",
    description: "אלרגיה לשומשום הופכת נפוצה יותר ויכולה לגרום לתגובות חמורות.",
    symptoms: ["פריחה", "קשיי נשימה", "בחילות", "אנפילקסיס"],
    avoidList: ["טחינה", "חלבה", "לחמניות עם שומשום", "שמן שומשום"],
    alternatives: [
      { name: "חמאת בוטנים", description: "אם אין אלרגיה לבוטנים" },
      { name: "ממרח אבוקדו", description: "חלופה בריאה לממרחים" },
      { name: "טחינת דלעת", description: "עשויה מגרעיני דלעת" }
    ],
    severity: "High"
  },
  {
    name: "Sulfites",
    hebrewName: "סולפיטים",
    icon: "🍷",
    description: "סולפיטים הם חומרים משמרים שיכולים לגרום לתגובות אלרגיות אצל אנשים רגישים.",
    symptoms: ["כאבי ראש", "קשיי נשימה", "פריחה"],
    avoidList: ["יין", "פירות יבשים", "תפוחי אדמה מעובדים", "חלק מהתרופות"],
    alternatives: [
      { name: "מזון טרי", description: "ללא תוספת חומרים משמרים" },
      { name: "יינות אורגניים ללא סולפיטים", description: "חלופה ליינות רגילים" }
    ],
    severity: "Medium"
  },
  {
    name: "Celery",
    hebrewName: "סלרי",
    icon: "🥬",
    description: "אלרגיה לסלרי יכולה להיות חמורה ומסוכנת, במיוחד באירופה.",
    symptoms: ["נפיחות בפה ובגרון", "קשיי נשימה", "בחילות"],
    avoidList: ["סלרי", "זרעי סלרי", "מלח סלרי", "מרקים ורטבים מסוימים"],
    alternatives: [
      { name: "פטרוזיליה", description: "יכולה להחליף סלרי בחלק מהמתכונים" },
      { name: "כוסברה", description: "מוסיפה טעם רענן למנות" },
      { name: "שמיר", description: "חלופה נוספת לתיבול" }
    ],
    severity: "Medium"
  },
  {
    name: "Mustard",
    hebrewName: "חרדל",
    icon: "🌭",
    description: "אלרגיה לחרדל יכולה להיות חמורה ומופיעה לעתים קרובות יחד עם אלרגיות אחרות.",
    symptoms: ["נפיחות בפה", "קשיי נשימה", "כאבי בטן"],
    avoidList: ["חרדל", "מיונז", "רטבים מסוימים", "תבלינים מעורבבים"],
    alternatives: [
      { name: "חומץ בלסמי", description: "מוסיף טעם חמצמץ לסלטים ורטבים" },
      { name: "רוטב צ'ילי", description: "מוסיף חריפות למנות" },
      { name: "וסאבי", description: "אם אין אלרגיה, יכול להחליף את החריפות של חרדל" }
    ],
    severity: "Medium"
  },
  {
    name: "Lupin",
    hebrewName: "לופין",
    icon: "🌿",
    description: "לופין הוא סוג של קטנית שמשמשת לעתים כתחליף לגלוטן ויכולה לגרום לתגובות אלרגיות.",
    symptoms: ["פריחה", "נפיחות", "קשיי נשימה"],
    avoidList: ["קמח לופין", "מאפים ללא גלוטן מסוימים", "חטיפים מסוימים"],
    alternatives: [
      { name: "קמח אורז", description: "חלופה נפוצה לקמח רגיל" },
      { name: "קמח תפוחי אדמה", description: "משמש להכנת מאפים ללא גלוטן" },
      { name: "קמח קוקוס", description: "אפשרות נוספת לאפייה ללא גלוטן" }
    ],
    severity: "Medium"
  },
  {
    name: "Kiwi",
    hebrewName: "קיווי",
    icon: "🥝",
    description: "אלרגיה לקיווי יכולה להיות קשורה לאלרגיות אחרות כמו לטקס ואבוקדו.",
    symptoms: ["גרד בפה", "נפיחות בשפתיים ובלשון", "קשיי נשימה"],
    avoidList: ["קיווי", "מיצים ושייקים המכילים קיווי", "סלטי פירות מסוימים"],
    alternatives: [
      { name: "תפוח", description: "פרי חלופי עם מרקם דומה" },
      { name: "אגס", description: "פרי נוסף שיכול להחליף קיווי בסלטים" },
      { name: "ענבים", description: "מוסיפים מתיקות ומרקם לסלטי פירות" }
    ],
    severity: "Medium"
  },
  {
    name: "Avocado",
    hebrewName: "אבוקדו",
    icon: "🥑",
    description: "אלרגיה לאבוקדו יכולה להיות קשורה לאלרגיה ללטקס.",
    symptoms: ["גרד בפה", "נפיחות בשפתיים", "בחילות"],
    avoidList: ["אבוקדו", "גואקמולי", "סלטים ומאכלים המכילים אבוקדו"],
    alternatives: [
      { name: "חומוס", description: "ממרח חלופי עשיר בחלבון" },
      { name: "טחינה", description: "אם אין אלרגיה לשומשום, יכולה להחליף אבוקדו בכריכים" },
      { name: "ממרח זיתים", description: "חלופה עשירה בשומן בריא" }
    ],
    severity: "Medium"
  },
  {
    name: "Garlic",
    hebrewName: "שום",
    icon: "🧄",
    description: "אלרגיה לשום היא נדירה יחסית אך יכולה להיות חמורה.",
    symptoms: ["צריבה בפה", "קשיי נשימה", "כאבי בטן"],
    avoidList: ["שום טרי", "אבקת שום", "רטבים ותבשילים רבים"],
    alternatives: [
      { name: "בצל ירוק", description: "מוסיף טעם עדין למנות" },
      { name: "עשבי תיבול אחרים", description: "כמו אורגנו או בזיליקום להוספת טעם" },
      { name: "ג'ינג'ר", description: "יכול להוסיף חריפות עדינה כתחליף לשום" }
    ],
    severity: "Medium"
  },
  {
    name: "Tomato",
    hebrewName: "עגבנייה",
    icon: "🍅",
    description: "אלרגיה לעגבניות יכולה להתבטא בתגובות עוריות ובמערכת העיכול.",
    symptoms: ["פריחה", "גרד בפה", "כאבי בטן"],
    avoidList: ["עגבניות טריות", "רוטב עגבניות", "קטשופ", "מאכלים רבים המכילים עגבניות"],
    alternatives: [
      { name: "רוטב פסטו", description: "חלופה טעימה לרוטב עגבניות" },
      { name: "רוטב שמנת", description: "אפשרות נוספת לרטבים ללא עגבניות" },
      { name: "רוטב בשמל", description: "רוטב קרמי שיכול להחליף רוטב עגבניות במתכונים רבים" }
    ],
    severity: "Medium"
  },
  {
    name: "Celiac",
    hebrewName: "צליאק",
    icon: "🍞",
    description: "צליאק היא מחלה אוטואימונית הנגרמת מתגובה לגלוטן.",
    symptoms: ["כאבי בטן", "שלשולים", "עייפות", "אנמיה"],
    avoidList: ["חיטה", "שעורה", "שיפון", "לחם רגיל", "פסטה רגילה", "בירה"],
    alternatives: [
      { name: "קמח אורז", description: "חלופה נפוצה לקמח חיטה" },
      { name: "קמח תירס", description: "משמש להכנת מאפים ללא גלוטן" },
      { name: "קינואה", description: "דגן ללא גלוטן עשיר בחלבון" },
      { name: "כוסמת", description: "למרות השם, אינה מכילה גלוטן ומתאימה לחולי צליאק" },
      { name: "מוצרים ללא גלוטן", description: "מגוון רחב של מוצרים מיוחדים לחולי צליאק" }
    ],
    severity: "High"
  }
];

export default allergenSeedData;