import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {Backend} from '../../../../backend/backend';
import {map} from 'rxjs';

export const cityParamCanActivateFn: CanActivateFn = (route) => {
  const cityParam = route.queryParamMap.get('city');

  if(cityParam == null) {
    return true;
  }


  const queryParams = { ...route.queryParams };
  const router = inject(Router);
  return inject(Backend).getCitiesForAuthenticatedUser$().pipe(
    map(allowedCities => (allowedCities as string[]).includes(cityParam)),
    map(isCityParamValid => {
      if(isCityParamValid) {
        return true;
      } else {
        delete queryParams['city'];

        console.warn('cityParamCanActivateFn: invalid city param - removing');

        return router.createUrlTree(['/can-activate/concerts-nearby'], queryParams);
      }
    })
  )
}
