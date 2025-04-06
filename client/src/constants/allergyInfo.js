import { FaInfoCircle, FaChartBar, FaClipboardList } from 'react-icons/fa';

export const generalInfo = [
  {
    title: "מהי אלרגיה למזון?",
    content: "אלרגיה למזון היא תגובה חיסונית חריגה לחלבונים מסוימים במזון. התגובה יכולה לנוע מקלה עד חמורה ומסכנת חיים.",
    icon: <FaInfoCircle />,
  },
  {
    title: "סטטיסטיקות",
    content: "כ-5% מהמבוגרים וכ-8% מהילדים סובלים מאלרגיות מזון. האלרגיות הנפוצות ביותר הן לבוטנים, אגוזי עץ, חלב, ביצים ודגים.",
    icon: <FaChartBar />,
  },
  {
    title: "טיפים להתמודדות",
    content: "קראו תוויות מזון בקפידה, הימנעו מחשיפה לאלרגנים, שאו אפיפן במקרה הצורך, והיוועצו עם רופא או תזונאי לגבי תחליפים מתאימים.",
    icon: <FaClipboardList />,
  },
];

export const additionalResources = [
  { title: "מדריך לקריאת תוויות מזון", url: "#" },
  { title: "מתכונים ללא אלרגנים נפוצים", url: "#" },
  { title: "קבוצות תמיכה לאנשים עם אלרגיות מזון", url: "#" },
];