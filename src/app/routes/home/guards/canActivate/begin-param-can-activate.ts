import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import dayjs from 'dayjs';
import {DATETIME_FORMAT, DATETIME_REGEX} from '../../../../shared/constants/date';

export const beginParamCanActivateFn: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);

  const beginParam = route.queryParamMap.get('begin');

  if(beginParam && DATETIME_REGEX.test(beginParam)) {
    return true;
  } else {
    const queryParams = {...route.queryParams};
    queryParams['begin'] = dayjs(new Date())
      .format(DATETIME_FORMAT)

    console.warn('beginParamCanActivateFn: invalid param - set default');

    return router.createUrlTree(['/can-activate/concerts-nearby'], {queryParams})
    // return of(router.createUrlTree(['/can-activate/concerts-nearby'], {queryParams})).pipe(delay(1000));
  }
}
