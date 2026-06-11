export interface TimeFilterConfig {
  enabled: boolean;
  time_slots: string[];
  days: string[];
  timezone: string;
  csv_file_timezone: string;
}

export const defaultTimeFilterConfig: TimeFilterConfig = {
  enabled: false,
  time_slots: ['00:00-23:59'],
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  timezone: 'GMT+3',
  csv_file_timezone: 'GMT+3'
};

export function isTimestampAllowed(timestamp: number, config: TimeFilterConfig): boolean {
  if (!config.enabled) return true;
  
  let offsetHours = 3;
  if (config.timezone && config.timezone.includes('+')) {
    const hours = parseInt(config.timezone.split('+')[1]);
    if (!isNaN(hours)) offsetHours = hours;
  } else if (config.timezone && config.timezone.includes('-')) {
    const hours = parseInt(config.timezone.split('-')[1]);
    if (!isNaN(hours)) offsetHours = -hours;
  }
  
  const isSeconds = timestamp < 1e11;
  const d = new Date(isSeconds ? timestamp * 1000 : timestamp);
  
  const utcMs = d.getTime() + (d.getTimezoneOffset() * 60000);
  const tzMs = utcMs + (offsetHours * 3600000);
  const tzDate = new Date(tzMs);
  
  const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = daysMap[tzDate.getDay()];
  
  if (config.days && config.days.length > 0 && !config.days.includes(dayName)) {
    return false;
  }
  
  if (config.time_slots && config.time_slots.length > 0) {
    const hours = tzDate.getHours();
    const minutes = tzDate.getMinutes();
    const currentMins = hours * 60 + minutes;
    
    let slotMatched = false;
    for (const slot of config.time_slots) {
      const [start, end] = slot.split('-');
      if (!start || !end) continue;
      
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) continue;
      
      const startMins = sh * 60 + sm;
      const endMins = eh * 60 + em;
      
      if (currentMins >= startMins && currentMins <= endMins) {
        slotMatched = true;
        break;
      }
    }
    
    if (!slotMatched) return false;
  }
  
  return true;
}
