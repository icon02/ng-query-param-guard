import {QueryParamGuardFn} from '../../../../shared/utils/query-param-guard';
import {RouteQueryParamObj} from './route-query-param-obj';
import {DATETIME_FORMAT, DATETIME_REGEX} from '../../../../shared/constants/date';
import  dayjs from 'dayjs';

export const endQueryParamGuardFn: QueryParamGuardFn<RouteQueryParamObj> = (queryParams) => {
  console.log(queryParams);

  if (!queryParams.end || !DATETIME_REGEX.test(queryParams.end)) {
    console.warn('endQueryParamGuardFn: invalid param - set default');

    return {...queryParams, begin:
        dayjs(queryParams.begin, DATETIME_FORMAT)
          .add(1, 'year')
          .format(DATETIME_FORMAT)}
    // return of({ ...queryParams, begin: dayjs().format(DATETIME_FORMAT)});
  } else {
    return true;
  }
}
