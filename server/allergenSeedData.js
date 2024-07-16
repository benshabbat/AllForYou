const allergenSeedData = [
  {
    name: "Milk",
    hebrewName: "חלב",
    icon: "🥛",
    description: "אלרגיה לחלב פרה היא אחת האלרגיות הנפוצות ביותר, במיוחד אצל תינוקות וילדים.",
    symptoms: ["פריחה", "בחילות", "כאבי בטן", "שלשולים"],
    avoidList: ["חלב", "גבינה", "יוגורט", "חמאה"],
    alternatives: ["משקה סויה", "משקה שקדים", "משקה אורז"],
    severity: "Medium"
  },
  {
    name: "Eggs",
    hebrewName: "ביצים",
    icon: "🥚",
    description: "אלרגיה לביצים היא נפוצה מאוד ויכולה לגרום לתגובות מיידיות.",
    symptoms: ["פריחה", "בחילות", "קשיי נשימה"],
    avoidList: ["ביצים", "מאפים המכילים ביצים", "מיונז"],
    alternatives: ["תחליפי ביצה מסחריים", "בננה מעוכה", "זרעי פשתן טחונים"],
    severity: "High"
  },
  {
    name: "Peanuts",
    hebrewName: "בוטנים",
    icon: "🥜",
    description: "אלרגיה לבוטנים היא אחת האלרגיות המסוכנות ביותר ויכולה לגרום לתגובות חמורות.",
    symptoms: ["נפיחות בפה", "קשיי נשימה", "אנפילקסיס"],
    avoidList: ["בוטנים", "חמאת בוטנים", "שמן בוטנים"],
    alternatives: ["טחינה", "חמאת שקדים", "חמאת גרעיני דלעת"],
    severity: "High"
  },
  {
    name: "Tree Nuts",
    hebrewName: "אגוזי עץ",
    icon: "🌰",
    description: "אלרגיה לאגוזי עץ יכולה להיות חמורה ולעיתים קרובות נמשכת לאורך כל החיים.",
    symptoms: ["נפיחות בגרון", "קשיי נשימה", "פריחה"],
    avoidList: ["שקדים", "אגוזי מלך", "אגוזי לוז", "אגוזי קשיו"],
    alternatives: ["זרעי דלעת", "זרעי חמניות", "אבוקדו"],
    severity: "High"
  },
  {
    name: "Fish",
    hebrewName: "דגים",
    icon: "🐟",
    description: "אלרגיה לדגים היא בדרך כלל אלרגיה לכל סוגי הדגים ויכולה להיות חמורה.",
    symptoms: ["בחילות", "כאבי בטן", "קשיי נשימה"],
    avoidList: ["כל סוגי הדגים", "רוטב דגים", "סושי"],
    alternatives: ["טופו", "עדשים", "קטניות"],
    severity: "High"
  },
  {
    name: "Soy",
    hebrewName: "סויה",
    icon: "🫘",
    description: "אלרגיה לסויה היא נפוצה יותר אצל תינוקות וילדים, אך יכולה להופיע גם אצל מבוגרים.",
    symptoms: ["פריחה", "בחילות", "קשיי נשימה"],
    avoidList: ["טופו", "חלב סויה", "רוטב סויה"],
    alternatives: ["משקאות צמחיים אחרים", "חלבון אפונה", "קטניות אחרות"],
    severity: "Medium"
  },
  {
    name: "Wheat",
    hebrewName: "חיטה",
    icon: "🌾",
    description: "אלרגיה לחיטה שונה מצליאק ויכולה לגרום לתגובות מיידיות.",
    symptoms: ["כאבי בטן", "שלשולים", "פריחה"],
    avoidList: ["לחם", "פסטה", "עוגות מקמח חיטה"],
    alternatives: ["קמח אורז", "קמח תירס", "קמח קוקוס"],
    severity: "Medium"
  },
  // {
  //   name: "Shellfish",
  //   hebrewName: "פירות ים",
  //   icon: "🦐",
  //   description: "אלרגיה לפירות ים היא אחת האלרגיות הנפוצות והמסוכנות ביותר.",
  //   symptoms: ["בחילות", "הקאות", "קשיי נשימה", "סחרחורות"],
  //   avoidList: ["שרימפס", "סרטנים", "לובסטר", "צדפות", "קלמארי"],
  //   alternatives: ["דגים (אם אין אלרגיה)", "טופו", "פטריות"],
  //   severity: "High"
  // },
  {
    name: "Sulfites",
    hebrewName: "סולפיטים",
    icon: "🍷",
    description: "סולפיטים הם חומרים משמרים שיכולים לגרום לתגובות אלרגיות אצל אנשים רגישים.",
    symptoms: ["כאבי ראש", "קשיי נשימה", "פריחה"],
    avoidList: ["יין", "פירות יבשים", "תפוחי אדמה מעובדים", "חלק מהתרופות"],
    alternatives: ["מזון טרי", "יינות אורגניים ללא סולפיטים"],
    severity: "Medium"
  },
  {
    name: "Celery",
    hebrewName: "סלרי",
    icon: "🥬",
    description: "אלרגיה לסלרי יכולה להיות חמורה ומסוכנת, במיוחד באירופה.",
    symptoms: ["נפיחות בפה ובגרון", "קשיי נשימה", "בחילות"],
    avoidList: ["סלרי", "זרעי סלרי", "מלח סלרי", "מרקים ורטבים מסוימים"],
    alternatives: ["פטרוזיליה", "כוסברה", "שמיר"],
    severity: "Medium"
  },
  {
    name: "Mustard",
    hebrewName: "חרדל",
    icon: "🌭",
    description: "אלרגיה לחרדל יכולה להיות חמורה ומופיעה לעתים קרובות יחד עם אלרגיות אחרות.",
    symptoms: ["נפיחות בפה", "קשיי נשימה", "כאבי בטן"],
    avoidList: ["חרדל", "מיונז", "רטבים מסוימים", "תבלינים מעורבבים"],
    alternatives: ["חומץ בלסמי", "רוטב צ'ילי", "וסאבי (אם אין אלרגיה)"],
    severity: "Medium"
  },
  {
    name: "Lupin",
    hebrewName: "לופין",
    icon: "🌱",
    description: "לופין הוא סוג של קטנית שמשמשת לעתים כתחליף לגלוטן ויכולה לגרום לתגובות אלרגיות.",
    symptoms: ["פריחה", "נפיחות", "קשיי נשימה"],
    avoidList: ["קמח לופין", "מאפים ללא גלוטן מסוימים", "חטיפים מסוימים"],
    alternatives: ["קמח אורז", "קמח תפוחי אדמה", "קמח קוקוס"],
    severity: "Medium"
  },
  {
    name: "Sesame",
    hebrewName: "שומשום",
    icon: "🌱",
    description: "אלרגיה לשומשום הופכת נפוצה יותר ויכולה לגרום לתגובות חמורות.",
    symptoms: ["פריחה", "קשיי נשימה", "בחילות", "אנפילקסיס"],
    avoidList: ["טחינה", "חלבה", "לחמניות עם שומשום", "שמן שומשום"],
    alternatives: ["חמאת בוטנים (אם אין אלרגיה)", "ממרח אבוקדו", "טחינת דלעת"],
    severity: "High"
  },
  {
    name: "Kiwi",
    hebrewName: "קיווי",
    icon: "🥝",
    description: "אלרגיה לקיווי יכולה להיות קשורה לאלרגיות אחרות כמו לטקס ואבוקדו.",
    symptoms: ["גרד בפה", "נפיחות בשפתיים ובלשון", "קשיי נשימה"],
    avoidList: ["קיווי", "מיצים ושייקים המכילים קיווי", "סלטי פירות מסוימים"],
    alternatives: ["תפוח", "אגס", "ענבים"],
    severity: "Medium"
  },
  {
    name: "Avocado",
    hebrewName: "אבוקדו",
    icon: "🥑",
    description: "אלרגיה לאבוקדו יכולה להיות קשורה לאלרגיה ללטקס.",
    symptoms: ["גרד בפה", "נפיחות בשפתיים", "בחילות"],
    avoidList: ["אבוקדו", "גואקמולי", "סלטים ומאכלים המכילים אבוקדו"],
    alternatives: ["חומוס", "טחינה (אם אין אלרגיה לשומשום)", "ממרח זיתים"],
    severity: "Medium"
  },
  {
    name: "Garlic",
    hebrewName: "שום",
    icon: "🧄",
    description: "אלרגיה לשום היא נדירה יחסית אך יכולה להיות חמורה.",
    symptoms: ["צריבה בפה", "קשיי נשימה", "כאבי בטן"],
    avoidList: ["שום טרי", "אבקת שום", "רטבים ותבשילים רבים"],
    alternatives: ["בצל ירוק", "עשבי תיבול אחרים", "ג'ינג'ר"],
    severity: "Medium"
  },
  {
    name: "Tomato",
    hebrewName: "עגבנייה",
    icon: "🍅",
    description: "אלרגיה לעגבניות יכולה להתבטא בתגובות עוריות ובמערכת העיכול.",
    symptoms: ["פריחה", "גרד בפה", "כאבי בטן"],
    avoidList: ["עגבניות טריות", "רוטב עגבניות", "קטשופ", "מאכלים רבים המכילים עגבניות"],
    alternatives: ["רוטב פסטו", "רוטב שמנת", "רוטב בשמל"],
    severity: "Medium"
  }
];

export default allergenSeedData;