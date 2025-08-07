import {QueryParamGuardFn} from '../../../../shared/utils/query-param-guard';
import {RouteQueryParamObj} from './route-query-param-obj';

export const beginBeforeEndQueryParamGuardFn: QueryParamGuardFn<RouteQueryParamObj> = (queryParams) => {
  console.log(queryParams);

  const begin = new Date(queryParams.begin!);
  const end = new Date(queryParams.end!);

  if(begin.getTime() < end.getTime()) {
    return true;
  } else {
    console.warn('beginBeforeEndQueryParamGuardFn: end is before begin - cancelling navigation');
    return false;
  }
}
