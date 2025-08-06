import {MaybeAsync} from '@angular/router';
import {from, Observable, of} from 'rxjs';

export function maybeAsyncToObservable<T>(result: MaybeAsync<T>): Observable<T> {
  if (result instanceof Promise) {
    return from(result);
  } else if (result instanceof Observable) {
    return result;
  } else {
    return of(result);
  }
}
