import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  EMPTY,
  fromEvent,
  interval,
  map,
  mapTo,
  merge, Observable,
  of,
  scan,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap
} from 'rxjs';

export type SessionEvt =
  | { type: 'tick'; delta: number }
  | { type: 'reset' };

@Component({
  selector: 'app-sidebar-timer',
  imports: [],
  templateUrl: './sidebar-timer.component.html',
  styleUrls: ['./sidebar-timer.component.scss'],
})
export class SidebarTimerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private stop$ = new Subject<void>();
  private reset$ = new Subject<void>();

  @Input() storageKey = 'sidebarTimer:default';

  // базовое накопленное время из прошлых сессий (persisted)
  #baseMs = 0;
  // сколько накапало за ТЕКУЩИЙ маунт компонента
  #sessionMs = 0;
  #timeText = '0 сек';

  #startAt = 0

  get timeText() { return this.#timeText; }

  ngOnInit() {
    // 1) восстановить базу
    this.#baseMs = this.load();
    this.#timeText = this.formatTime(this.#baseMs);
    // 2) видимость вкладки
    const visible$ = merge(
      of(!document.hidden),
      fromEvent(document, 'visibilitychange').pipe(map(() => !document.hidden))
    );
    // 3) события: тики (только когда видимо) + сброс
    const events$ = merge(
      this.reset$.pipe(map((): SessionEvt => ({ type: 'reset' }))),
      visible$.pipe(
        switchMap(visible =>
          visible
            ? interval(1000).pipe(mapTo<SessionEvt>({ type: 'tick', delta: 1000 }))
            : (EMPTY as Observable<SessionEvt>)))
    );
    // 4) аккумулировать сессию, учитывая reset
    events$
      .pipe(
        startWith<SessionEvt>({ type: 'reset' }),
        scan((acc: number, ev: SessionEvt) => ev.type === 'reset' ? 0 : acc + ev.delta, 0),
        tap(ms => {
          this.#sessionMs = ms;
          this.#timeText = this.formatTime(this.#baseMs + this.#sessionMs);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    // 5) сохранять прогресс при скрытии и выгрузке
    const persistNow = () => this.persist(this.#baseMs + this.#sessionMs);

    fromEvent(document, 'visibilitychange')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => { if (document.hidden) persistNow(); });

    fromEvent(window, 'pagehide')
      .pipe(takeUntil(this.destroy$))
      .subscribe(persistNow);

    fromEvent(window, 'beforeunload')
      .pipe(takeUntil(this.destroy$))
      .subscribe(persistNow);
  }

  // Сброс по кнопке
  reset() {
    this.#baseMs = 0;
    this.#sessionMs = 0;
    this.persist(0);
    this.reset$.next();
    this.#timeText = this.formatTime(0);
  }

  private persist(ms: number) {
    try { localStorage.setItem(this.storageKey, String(ms)); } catch {}
  }

  private load(): number {
    try {
      const raw = localStorage.getItem(this.storageKey);
      const n = raw ? Number(raw) : 0;
      return Number.isFinite(n) && n >= 0 ? n : 0;
    } catch { return 0; }
  }

  formatTime(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const hour = Math.floor(totalSec / 3600);
    const min = Math.floor((totalSec % 3600) / 60);
    const sec = totalSec % 60;

    if (hour > 0) return `${hour} ч ${min} мин ${sec} сек`;
    if (min > 0) return `${min} мин ${sec} сек`;
    return `${sec} сек`;
  }

  ngOnDestroy() {
    // фиксируем всё накопленное активное время
    this.persist(this.#baseMs + this.#sessionMs);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
