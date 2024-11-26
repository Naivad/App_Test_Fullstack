import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  private minimumLoadingTime = 1000; // 1 second minimum loading time

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  wrapWithLoading<T>(obs: Observable<T>): Observable<T> {
    this.setLoading(true);
    const start = Date.now();

    return new Observable<T>(subscriber => {
      obs.pipe(
        finalize(() => {
          const elapsed = Date.now() - start;
          const remainingTime = Math.max(0, this.minimumLoadingTime - elapsed);
          
          timer(remainingTime).subscribe(() => {
            this.setLoading(false);
          });
        })
      ).subscribe({
        next: (value) => subscriber.next(value),
        error: (error) => subscriber.error(error),
        complete: () => subscriber.complete()
      });
    });
  }
}