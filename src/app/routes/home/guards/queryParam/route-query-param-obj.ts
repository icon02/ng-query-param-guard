import {ConcertTableFilter} from '../../../../shared/components/concert-table/concert-table';

export type RouteQueryParamObj = {
  [K in keyof ConcertTableFilter]?: string
}
