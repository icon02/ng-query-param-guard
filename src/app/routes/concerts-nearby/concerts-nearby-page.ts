import {Component, computed, inject, input} from '@angular/core';
import {ConcertTable, ConcertTableFilter} from '../../shared/components/concert-table/concert-table';
import {City} from '../../model/city';
import {Concert} from '../../model/concert';
import {Router} from '@angular/router';

@Component({
  selector: 'app-concerts-nearby-page',
  templateUrl: './concerts-nearby-page.html',
  imports: [
    ConcertTable
  ],
  styleUrls: ['./concerts-nearby-page.css']
})
export class ConcertsNearbyPage {
  private readonly router = inject(Router);

  $concerts = input.required<Concert[]>({alias: 'concerts'});
  $cityOptions = input.required<City[]>({alias: 'cityOptions'});

  /**
   * from queryParams
   */
  $beginFilter = input.required<string>({alias: 'begin'});
  /**
   * from queryParams
   */
  $endFilter = input.required<string>({alias: 'end'});
  $cityFilter = input.required<City | null | undefined>({alias: 'city'});

  $concertTableFilter = computed(() => {
    const begin = this.$beginFilter();
    const end = this.$endFilter();
    const city = this.$cityFilter();

    return {
      begin,
      end,
      city,
    }
  })

  protected updateFilter(filter: ConcertTableFilter): void {
    const queryParams: ConcertTableFilter = {...filter};

    !queryParams.city && delete queryParams.city;

    this.router.navigate(['/concerts-nearby'], {queryParams});
  }
}
