import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import dayjs from 'dayjs';
import {DATETIME_FORMAT} from '../../../../shared/constants/date';

export const endParamCanActivateFn: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);

  const endParam = route.queryParamMap.get('end');

  if(dayjs(endParam).isValid()) {
    console.log('endParam is valid');
    return true;
  } else {
    const queryParams = {...route.queryParams};
    queryParams['end'] = dayjs(new Date())
      .add(1, 'year')
      .format(DATETIME_FORMAT);

    console.warn('endParamCanActivateFn: invalid param - setting default');

    return router.createUrlTree(['/can-activate/concerts-nearby'], {queryParams});
    // return of(router.createUrlTree(['/can-activate/concerts-nearby'], {queryParams})).pipe(delay(1000));
  }
}
