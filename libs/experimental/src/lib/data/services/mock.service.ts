// mock.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Address, Job, Worker, ReceiverType } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class MockService {
  ReceiverType = ReceiverType;

  private API = 'http://localhost:3000';

  // локальные адреса (пример)
  private addresses$ = new BehaviorSubject<Address[]>([
    { city: 'Moscow', street: 'Lenina', building: 8, apartment: 6 },
    { city: 'SPB', street: 'Nevsky', building: 10, apartment: null },
  ]);

  constructor(private http: HttpClient) {}

  getAddresses(): Observable<Address[]> {
    return this.addresses$.asObservable();
  }
  addAddress(a: Address) {
    this.addresses$.next([...this.addresses$.value, a]);
  }
  deleteAddress(idx: number) {
    const list = [...this.addresses$.value];
    list.splice(idx, 1);
    this.addresses$.next(list);
  }

  // ====== JOBS ======
  getJobs(): Observable<Job[]> {
    return this.http
      .get<Job[]>(`${this.API}/jobs`)
      .pipe(catchError(this.handleError<Job[]>('getJobs', [])));
  }
  addJob(job: Job): Observable<Job> {
    return this.http
      .post<Job>(`${this.API}/jobs`, job)
      .pipe(catchError(this.handleError<Job>('addJob')));
  }
  updateJob(id: number, job: Job): Observable<Job> {
    return this.http
      .put<Job>(`${this.API}/jobs/${id}`, job)
      .pipe(catchError(this.handleError<Job>('updateJob')));
  }
  deleteJob(id: number): Observable<any> {
    return this.http
      .delete(`${this.API}/jobs/${id}`)
      .pipe(catchError(this.handleError('deleteJob')));
  }

  // ====== WORKERS ======
  getWorkers(): Observable<Worker[]> {
    return this.http
      .get<Worker[]>(`${this.API}/workers`)
      .pipe(catchError(this.handleError<Worker[]>('getWorkers', [])));
  }
  addWorker(w: any): Observable<any> {
    return this.http
      .post<any>(`${this.API}/workers`, w)
      .pipe(catchError(this.handleError('addWorker')));
  }
  updateWorker(id: number, w: any): Observable<any> {
    return this.http
      .put<any>(`${this.API}/workers/${id}`, w)
      .pipe(catchError(this.handleError('updateWorker')));
  }
  deleteWorker(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.API}/workers/${id}`)
      .pipe(catchError(this.handleError('deleteWorker')));
  }

  // простая обработка ошибок
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // возвращаем безопасный результат, чтобы UI не упал
      return of(result as T);
    };
  }
}
