import {ActivatedRouteSnapshot, CanActivateFn, GuardResult, MaybeAsync, Router} from '@angular/router';
import { firstValueFrom, forkJoin, from, map, Observable, of } from 'rxjs';
import { EnvironmentInjector, inject, Injector } from '@angular/core';
import { removeUndefinedProps } from './object';
import { maybeAsyncToObservable } from './async';

/**
 * generic `T` to be a definition of the QueryParams;
 *
 * The result should either be:
 *  - true: if queryParam was checked successfully
 *  - false: if queryParam was checked and navigation should cancel
 *  - `T`: if queryParams needed to be updated
 */
export type ResolvedQueryParamGuardResult<T> = Partial<T> | boolean;

export type QueryParamGuardResult<T> = MaybeAsync<ResolvedQueryParamGuardResult<T>>;

export type RunInType = 'parallel' | 'serial';

export type QueryParamGuardFn<T> =
  ((queryParams: Partial<T>, injector: Injector) => QueryParamGuardResult<T>);



/**
 * Runs `QueryParamGuardFn`s in serial, starting with queryParamGuardFns[0] ... queryParamGuardFns[n].
 * Used if queryParamGuardFns are dependent on the evaluation of other queryParams.
 *
 * @param queryParamGuardFns
 *  list of functions to run in serial (**Note:** Order is important!)
 */
export function queryParamSerialGuardFactory<T>(...queryParamGuardFns: QueryParamGuardFn<T>[]) {
  return async (queryParams: Partial<T>, injector: Injector): Promise<Partial<T> | boolean> => {
    queryParams = removeUndefinedProps(queryParams);
    let requiresRedirect = false;

    for (const guard of queryParamGuardFns) {
      const guardOutput = guard(queryParams, injector);
      let guardResult: boolean | Partial<T>;
      if (guardOutput instanceof Promise) {
        guardResult = await guardOutput;
      } else if (guardOutput instanceof Observable) {
        guardResult = await firstValueFrom(guardOutput);
      } else {
        guardResult = guardOutput;
      }

      if (guardResult === false) {
        return false;
      } else if (guardResult !== true) {
        // guardResult are new queryParams
        requiresRedirect = true;
        const newQueryParams = removeUndefinedProps(guardResult);
        queryParams = {
          ...queryParams,
          ...newQueryParams
        };
      }
    }

    if (!requiresRedirect) {
      return true;
    } else {
      return queryParams;
    }
  };
}

/**
 * Runs `QueryParamGuardFn`s in parallel, therefore these functions must be independent.
 *
 * @Note parallel only accounts for async guards obviously
 *
 * @param queryParamGuardFns
 *  list of functions to run in parallel
 */
export function queryParamParallelGuardFactory<T>(...queryParamGuardFns: QueryParamGuardFn<T>[]) {
  return (queryParams: Partial<T>, injector: Injector): Observable<ResolvedQueryParamGuardResult<T>> => {
    const guardOutputObs$: Observable<boolean | Partial<T>>[] = queryParamGuardFns
      .map(fn => fn(queryParams, injector))
      .map(result => {
        if (result instanceof Promise) {
          return from(result);
        } else if (result instanceof Observable) {
          return result;
        } else {
          return of(result);
        }
      });

    return forkJoin(guardOutputObs$).pipe(map(results => {
      if (results.includes(false)) {
        return false;
      } else if (results.every(res => res === true)) {
        return true;
      } else {
        const queryParamResults = results
          .filter(res => typeof (res) !== 'boolean')
          .map(res => res as T);

        queryParamResults.forEach(queryParamResult => {
          queryParams = {
            ...queryParams,
            ...removeUndefinedProps(queryParamResult)
          };
        });

        return queryParams;
      }
    }));
  };
}

/**
 * Creates an `CanActivateFn` that runs `QueryParamGuardFn`s.
 *
 * Used to combine either ParallelQueryParamGuards or SerialQueryParamGuards and convert their
 * `QueryParamGuardResult` into Angular's `GuardResult`.
 * @param guards
 *  list of `QueryParamGuardFn`s
 * @param runIn
 *  specifies parallelism
 *
 * @Note Parallelism only takes effect when observable is async for obvious reasons
 */
export function queryParamGuardFactory<T>(
  guards: QueryParamGuardFn<T>[],
  runIn: RunInType = 'parallel',
): CanActivateFn {
  return (route: ActivatedRouteSnapshot): Observable<GuardResult> => {
    const injector = inject(EnvironmentInjector);
    const router = inject(Router);
    const queryParams = route.queryParams as Partial<T>;

    let result: QueryParamGuardResult<T>;
    if (runIn === 'parallel') {
      result = queryParamParallelGuardFactory<T>(...guards)(queryParams, injector);
    } else {
      result = queryParamSerialGuardFactory<T>(...guards)(queryParams, injector);
    }

    const guardRes = maybeAsyncToObservable(result);

    return guardRes.pipe(map(res => {
      if (typeof (res) === 'boolean') {
        return res;
      } else {
        const commands = route.pathFromRoot.flatMap(
          snapshot => snapshot.url.map(url => url.path)
        );

        return router.createUrlTree(commands, {
          queryParams: res,
        });
      }
    }));
  };
}
