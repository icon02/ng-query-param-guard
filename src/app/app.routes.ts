import {Route, Routes} from '@angular/router';
import {beginParamCanActivateFn} from './routes/concerts-nearby/guards/canActivate/begin-param-can-activate';
import {endParamCanActivateFn} from './routes/concerts-nearby/guards/canActivate/end-param-can-activate';
import {beginBeforeEndCanActivateFn} from './routes/concerts-nearby/guards/canActivate/begin-before-end-can-activate';
import {concertsResolver} from './routes/concerts-nearby/resolvers/concerts';
import {cityOptionsResolver} from './routes/concerts-nearby/resolvers/city-options';
import {queryParamGuardFactory, queryParamSerialGuardFactory} from './shared/utils/query-param-guard';
import {beginQueryParamGuardFn} from './routes/concerts-nearby/guards/queryParam/begin-query-param';
import {endQueryParamGuardFn} from './routes/concerts-nearby/guards/queryParam/end-query-param';
import {beginBeforeEndQueryParamGuardFn} from './routes/concerts-nearby/guards/queryParam/begin-before-end-query-param';
import {cityParamCanActivateFn} from "./routes/concerts-nearby/guards/canActivate/city-param-can-activate";
import {cityQueryParamGuardFn} from "./routes/concerts-nearby/guards/queryParam/city-query-param";

const concertsNearbyRouteBase: Partial<Route> = {
  pathMatch: 'full',
  runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  loadComponent: () => import('./routes/concerts-nearby/concerts-nearby-page').then(m => m.ConcertsNearbyPage),
  resolve: {
    concerts: concertsResolver,
    cityOptions: cityOptionsResolver
  }
}


export const routes: Routes = [
    {
      path: '',
      pathMatch: 'full',
      loadComponent: () => import('./routes/home/home-page').then(m => m.HomePage)
    },
    {
      ...concertsNearbyRouteBase,
      path: 'no-guards/concerts-nearby',
      canActivate: []
    },
    {
      ...concertsNearbyRouteBase,
      path: 'can-activate/concerts-nearby',
      canActivate: [
        beginParamCanActivateFn,
        endParamCanActivateFn,
        beginBeforeEndCanActivateFn,
        cityParamCanActivateFn
      ]
    },
    {
      ...concertsNearbyRouteBase,
      path: 'query-param/concerts-nearby',
      canActivate: [
        queryParamGuardFactory([
          cityQueryParamGuardFn,
          queryParamSerialGuardFactory(
            beginQueryParamGuardFn,
            endQueryParamGuardFn,
            beginBeforeEndQueryParamGuardFn
          )
        ])
      ]
    }
  ]
;
