import {
    ActivatedRouteSnapshot,
    GuardResult,
    MaybeAsync,
    Params,
    Router,
    RouterStateSnapshot,
    UrlSegment,
    UrlTree
} from '@angular/router';
import {
    queryParamGuardFactory,
    queryParamParallelGuardFactory,
    queryParamSerialGuardFactory
} from './query-param-guard';
import { Injector } from '@angular/core';
import { of } from 'rxjs';
import { maybeAsyncToObservable } from './async';
import { TestBed } from '@angular/core/testing';

describe('QueryParamGuardUtil', () => {
    describe('queryParamSerialGuardFactory', () => {
        it('should run the queryParamGuards in order', () => {
            const guard1 = (queryParams: Params): Params => {
                return {
                    ...queryParams,
                    requiredParam: 'required'
                };
            };

            const noRequiredParamError = new Error('[\'requiredParam\'] missing');
            const guard2 = (queryParams: Params): Params => {
                if (!queryParams['requiredParam']) {
                    throw noRequiredParamError;
                }

                return queryParams;
            };

            const serialGuard = queryParamSerialGuardFactory(guard1, guard2);

            expect(() => serialGuard({}, {} as Injector)).not.toThrow();
        });

        it('should not run guards after one that already returned false', () => {
            const guard1 = (): Params | boolean => {
                return false;
            };
            const guard2 = (): Params | boolean => {
                throw new Error('I must not be called');
            };

            const serialGuard = queryParamSerialGuardFactory(guard1, guard2);

            expect(() => serialGuard({}, {} as Injector)).not.toThrow();
        });

        it('should merge the new queryParams returned from the guards', async () => {
            const guard1 = (): Params => {
                return {
                    guard1: 'guard1'
                };
            };

            const guard2 = (): Params => {
                return {
                    guard2: 'guard2'
                };
            };

            const serialGuard = queryParamSerialGuardFactory(guard1, guard2);

            const serialGuardResult = await serialGuard({}, {} as Injector);
            expect(typeof serialGuardResult).not.toEqual('boolean');
            const paramResult = serialGuardResult as Params;
            expect(paramResult['guard1']).toEqual('guard1');
            expect(paramResult['guard2']).toEqual('guard2');
        });
    });

    describe('queryParamParallelGuardFactory', () => {
        it('should merge the new queryParams returned from the guards', (done) => {
            const guard1 = (): Params => {
                return {
                    guard1: 'guard1'
                };
            };

            const guard2 = (): Params => {
                return {
                    guard2: 'guard2'
                };
            };

            const parallelGuard = queryParamParallelGuardFactory(guard1, guard2);

            const parallelGuardResult$ = parallelGuard({}, {} as Injector);
            parallelGuardResult$.subscribe(result => {
                expect(typeof result).not.toEqual('boolean');
                const paramResult = result as Params;
                expect(paramResult['guard1']).toEqual('guard1');
                expect(paramResult['guard2']).toEqual('guard2');
                done();
            });
        });
    });

    describe('queryParamGuardFactory', () => {
        it('should return true if all of inner guards return true', (done) => {
            const guard = queryParamGuardFactory(
                [
                    () => true,
                    () => of(true)
                ]
            );

            const ars: ActivatedRouteSnapshot = {
                queryParams: {}
            } as ActivatedRouteSnapshot;
            const rss = {} as RouterStateSnapshot;

            let guardResult;
            TestBed.runInInjectionContext(() => {
                guardResult = guard(ars, rss);
            });

            maybeAsyncToObservable(guardResult).subscribe(result => {
                expect(result).toBeTrue();
                done();
            });
        });

        it('should return a url-tree with merged params of inner guards if one of them returns a new param-obj', (done) => {
            const guard = queryParamGuardFactory(
                [
                    () => true,
                    () => of({
                        test: 'my-test-param'
                    })
                ]
            );

            const ars: ActivatedRouteSnapshot = {
                queryParams: {},
                pathFromRoot: [
                    {
                        url: [
                            {
                                path: 'test'
                            } as UrlSegment
                        ]
                    } as ActivatedRouteSnapshot,
                ]
            } as ActivatedRouteSnapshot;
            const rss = {} as RouterStateSnapshot;

            let guardResult: MaybeAsync<GuardResult>;
            TestBed.runInInjectionContext(() => {
                guardResult = guard(ars, rss);
            });

            maybeAsyncToObservable(guardResult!).subscribe(val => {
                expect(val).toBeInstanceOf(UrlTree);
                val = val as UrlTree;
                expect(val.queryParams).toEqual({ test: 'my-test-param' });
                done();
            });
        });

        it('should handle complex pathFromRoots', (done) => {
            const ars: ActivatedRouteSnapshot = {
                queryParams: {},
                pathFromRoot: [
                    {
                        // simple url
                        url: [
                            {
                                path: 'simple-url'
                            } as UrlSegment
                        ]
                    } as ActivatedRouteSnapshot,
                    {
                        // empty url for snapshots where the component is loaded
                        url: [],
                        component: {} // just to showcase; when component is defined, the url is always empty array
                    },
                    {
                        // complex for when multi route configs exist with no component loading in between
                        url: [
                            { path: 'complex-url1' } as UrlSegment,
                            { path: 'complex-url2' } as UrlSegment
                        ]
                    }
                ]
            } as ActivatedRouteSnapshot;

            const guard = queryParamGuardFactory(
                [
                    () => true,
                    () => of({
                        test: 'my-test-param'
                    })
                ]
            );

            const router = TestBed.inject(Router);
            spyOn(router, 'createUrlTree');

            TestBed.runInInjectionContext(() => {
                maybeAsyncToObservable(guard(ars, {} as RouterStateSnapshot)).subscribe(() => {
                        expect(router.createUrlTree).toHaveBeenCalledWith(
                            ['simple-url', 'complex-url1', 'complex-url2'],
                            {
                                queryParams: {
                                    test: 'my-test-param'
                                }
                            }
                        );
                        done();
                    }
                );
            })

        });
    });
});