import {ActivatedRouteSnapshot} from '@angular/router';
import {ConcertTableFilter} from '../../../shared/components/concert-table/concert-table';
import {City} from '../../../model/city';
import {inject} from '@angular/core';
import {Backend} from '../../../backend/backend';
import {take} from 'rxjs';

export const concertsResolver = (route: ActivatedRouteSnapshot) => {
  const beginQueryParam = route.queryParamMap.get('begin');
  const endQueryParam = route.queryParamMap.get('end');
  const cityQueryParam = route.queryParamMap.get('city');

  const filter: ConcertTableFilter = {
    begin: beginQueryParam!,
    end: endQueryParam!,
    city: cityQueryParam as City | null | undefined,
  }

  console.log('concertResolver received filter', filter);

  return inject(Backend).getConcerts$(filter).pipe(take(1));
}
