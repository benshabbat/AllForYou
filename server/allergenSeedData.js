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
      name: "Shellfish",
      hebrewName: "פירות ים",
      icon: "🦐",
      description: "אלרגיה לפירות ים היא אחת האלרגיות הנפוצות ביותר אצל מבוגרים.",
      symptoms: ["פריחה", "נפיחות בפה", "קשיי נשימה"],
      avoidList: ["סרטנים", "לובסטר", "צדפות", "קלמארי"],
      alternatives: ["דגים (אם אין אלרגיה)", "טופו", "פטריות"],
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
    }
  ];
  
  export default allergenSeedData;