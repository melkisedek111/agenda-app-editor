import moment, { Duration } from 'moment';

export const formatMinutesToHoursAndMinutes = (totalMinutes: number): string => {
  const duration: Duration = moment.duration(totalMinutes, 'minutes');
  const hours: number = Math.floor(duration.asHours());
  const minutes: number = duration.minutes();

  let formattedTime: string = '';

  if (hours > 0) {
    formattedTime += `${hours} hr`;
    if (hours > 1) {
      formattedTime += 's'; // pluralize "hr" if needed
    }
    if (minutes > 0) {
      formattedTime += ` ${minutes} min`;
    }
  } else {
    formattedTime += `${minutes} min`;
  }

  return formattedTime;
}

