import {QueryParamGuardFn} from '../../../../shared/utils/query-param-guard';
import {DATETIME_FORMAT, DATETIME_REGEX} from '../../../../shared/constants/date';
import dayjs from 'dayjs';
import {RouteQueryParamObj} from './route-query-param-obj';
import {delay, of} from 'rxjs';

export const beginQueryParamGuardFn: QueryParamGuardFn<RouteQueryParamObj> = (queryParams) => {
  console.log(queryParams);
  if (!queryParams.begin || !DATETIME_REGEX.test(queryParams.begin)) {
    console.warn('beginQueryParamGuardFn: invalid param - set default');

    // return {...queryParams, begin: dayjs().format(DATETIME_FORMAT)}
    return of({ ...queryParams, begin: dayjs().format(DATETIME_FORMAT)}).pipe(delay(1000));
  } else {
    return true;
  }
}
