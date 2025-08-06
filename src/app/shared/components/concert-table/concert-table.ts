import {Component, input, output} from '@angular/core';
import {City} from '../../../model/city';
import {Concert} from '../../../model/concert';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import dayjs from 'dayjs';
import {DATETIME_FORMAT, DATETIME_REGEX} from '../../constants/date';

export interface ConcertTableFilter {
  city?: City | null;
  /**
   * in datetime-local format
   */
  begin: string;
  /**
   * in datetime-local format
   */
  end: string;
}

@Component({
  selector: 'app-concert-table',
  templateUrl: './concert-table.html',
  styleUrls: ['./concert-table.css'],
  imports: [
    DatePipe,
    FormsModule
  ]
})
export class ConcertTable {
  readonly $concerts = input<Concert[]>([], {alias: 'concerts'});
  readonly $cityOptions = input<City[]>([], {alias: 'cityOptions'});
  readonly $filter = input<ConcertTableFilter>({
    city: null,
    begin: dayjs().format(DATETIME_FORMAT),
    end: dayjs().add(1, 'year').format(DATETIME_FORMAT)
  }, {alias: 'filter'});

  readonly filterChanged = output<ConcertTableFilter>();

  onCityFilterEntered(value: City | null) {
    const cFilter = this.$filter();

    this.filterChanged.emit({
      ...cFilter,
      city: value
    });
  }

  onBeginFilterEntered(value: string | null) {
    if(value == null || !DATETIME_REGEX.test(value)) {
      return;
    }

    const cFilter = this.$filter();

    this.filterChanged.emit({
      ...cFilter,
      begin: value
    })
  }

  onEndFilterEntered(value: string | null) {
    if(value == null || !DATETIME_REGEX.test(value)) {
      return;
    }

    const cFilter = this.$filter();

    this.filterChanged.emit({
      ...cFilter,
      end: value
    });
  }
}
