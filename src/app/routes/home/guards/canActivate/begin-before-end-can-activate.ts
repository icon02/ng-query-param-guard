import {ActivatedRouteSnapshot, CanActivateFn} from '@angular/router';
import {DATETIME_REGEX} from '../../../../shared/constants/date';

export const beginBeforeEndCanActivateFn: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const beginParam = route.queryParamMap.get('begin');
  const endParam = route.queryParamMap.get('end');

  console.log('received params', beginParam, endParam);

  if(!beginParam || !DATETIME_REGEX.test(beginParam)) {
    throw new Error('invalid begin param');
  }
  if(!endParam || !DATETIME_REGEX.test(endParam)) {
    throw new Error('invalid end param');
  }

  const begin = new Date(beginParam!);
  const end = new Date(endParam!);

  if(begin < end) {
    return true;
  } else {
    console.warn('beginBeforeEndCanActivateFn: begin was after end - won\'t redirect');

    return false;
  }
}
