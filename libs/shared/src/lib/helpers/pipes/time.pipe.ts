import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: true,
})
export class TimePipe implements PipeTransform {
  transform(value: string | Date | number): string {
    if (!value) return 'Нет данных';

    // Нормализация входных данных
    let date: DateTime;
    if (typeof value === 'string') {
      date = DateTime.fromISO(value, { zone: 'utc' }).toLocal();
    } else if (typeof value === 'number') {
      // если timestamp в секундах → умножаем
      date =
        value.toString().length === 10
          ? DateTime.fromSeconds(value, { zone: 'utc' }).toLocal()
          : DateTime.fromMillis(value, { zone: 'utc' }).toLocal();
    } else {
      date = DateTime.fromJSDate(value).toLocal();
    }

    const now = DateTime.now();
    const diffInSeconds = Math.floor(now.diff(date, 'seconds').seconds);

    if (diffInSeconds < 60) return 'только что';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60)
      return `${diffInMinutes} ${this.pluralize(diffInMinutes, [
        'минута',
        'минуты',
        'минут',
      ])} назад`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} ${this.pluralize(diffInHours, [
        'час',
        'часа',
        'часов',
      ])} назад`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} ${this.pluralize(diffInDays, [
        'день',
        'дня',
        'дней',
      ])} назад`;

    // если больше недели → обычная дата
    return date.toFormat('dd.MM.yyyy HH:mm');
  }

  // функция склонения слов на русском
  private pluralize(num: number, forms: [string, string, string]): string {
    const n = Math.abs(num) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
  }
}
