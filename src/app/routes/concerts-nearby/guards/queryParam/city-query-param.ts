import {QueryParamGuardFn} from "../../../../shared/utils/query-param-guard";
import {RouteQueryParamObj} from "./route-query-param-obj";
import {Backend} from "../../../../backend/backend";
import {map, switchMap} from "rxjs";
import {getEnumValues} from "../../../../shared/utils/enum";
import {City} from "../../../../model/city";

export const cityQueryParamGuardFn: QueryParamGuardFn<RouteQueryParamObj> = (queryParams, injector) => {
    const backend = injector.get(Backend);
    const cityParam = queryParams['city'];

    if (!cityParam) {
        return true;
    }

    return backend.getCitiesForAuthenticatedUser$().pipe(
        map(cities => {
            if (getEnumValues(City).includes(cityParam)
                && cities.includes(cityParam as City)) {
                return true;
            } else {
                console.warn(`Invalid city param ${cityParam}. Removing..`)
                return {
                    ...queryParams,
                    city: undefined
                }
            }
        })
    )
}