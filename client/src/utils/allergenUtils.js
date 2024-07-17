export const translateSeverity = (severity) => {
    const severityMap = {
      'Low': 'נמוכה',
      'Medium': 'בינונית',
      'High': 'גבוהה',
      'Unknown': 'לא ידועה'
    };
    return severityMap[severity] || severity;
  };
  
  export const SEVERITY_CLASSES = {
    'Low': 'low',
    'Medium': 'medium',
    'High': 'high',
    'Unknown': 'unknown'
  };