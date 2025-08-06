import {Injectable} from '@angular/core';
import {Concert} from '../model/concert';
import {ConcertTableFilter} from '../shared/components/concert-table/concert-table';
import {delay, map, Observable, of, switchMap, throwError} from 'rxjs';
import {User} from '../model/user';
import {Country} from '../model/country';
import {Role} from '../model/role';
import {cityCountryLocations, countryCityLocations} from './repository/country-city-locations';
import {City} from '../model/city';
import {concerts} from './repository/concerts';
import {HttpErrorResponse} from '@angular/common/http';
import {DATETIME_REGEX} from '../shared/constants/date';

@Injectable({providedIn: 'root'})
export class Backend {

  private readonly authenticatedUser: User = {
    name: 'Max Mustermann',
    location: Country.GERMANY,
    role: Role.STANDARD
  }

  getConcerts$(filter: ConcertTableFilter): Observable<Concert[]> {
    return of(null).pipe(
      delay(this.randomHttpDelay()),

      // begin validation
      switchMap((val) => {
        if(!filter.begin || !DATETIME_REGEX.test(filter.begin)) {
          return throwError(() => new HttpErrorResponse({status: 400, statusText: 'begin parse error'}))
        } else {
          return of(val);
        }
      }),

      // end validation
      switchMap((val) => {
        if(!filter.end || !DATETIME_REGEX.test(filter.end)) {
          return throwError(() => new HttpErrorResponse({status: 400, statusText: 'end parse errror'}))
        } else {
          return of(val)
        }
      }),

      // begin before end validation
      switchMap((val) => {
        if(new Date(filter.begin) >= new Date(filter.end)) {
          return throwError(() => new HttpErrorResponse({status: 400, statusText: 'begin must be smaller than end'}));
        } else {
          return of(val);
        }
      }),

      // city existance check
      switchMap((val) => {
        if (filter.city != null && !cityCountryLocations.get(filter.city)) {
          // bad request if the city is not in the supported cities list
          return throwError(() => new HttpErrorResponse({status: 400, statusText: 'city from filter not found'}))
        } else if (filter.city != null && !this.getCitiesForCountry(this.authenticatedUser.location)?.includes(filter.city)) {
          // forbidden if the concerts for a location the user is currently not in were requested
          return throwError(() => new HttpErrorResponse({status: 403, statusText: 'user not in this area'}))
        } else {
          // request was fine
          return of(val);
        }
      }),

      // return actual result if all params are valid
      map(() => this.getConcerts(filter))
    )
  }

  getAuthenticatedUser$(): Observable<User> {
    return of(this.authenticatedUser).pipe(delay(this.randomHttpDelay()));
  }

  getCitiesForAuthenticatedUser$(): Observable<City[]> {
    const cities = this.getCitiesForCountry(this.authenticatedUser.location);

    if (cities) {
      return of(cities).pipe(delay(this.randomHttpDelay()));
    } else {
      return throwError(() => new HttpErrorResponse({status: 404, statusText: 'Country not found'}));
    }
  }

  private getConcerts(filter: ConcertTableFilter): Concert[] {
    return concerts
      // filter begin
      .filter((concert) => filter.begin ? new Date(concert.end) >= new Date(filter.begin) : true)
      // filter end
      .filter((concert) => filter.end ? new Date(concert.begin) <= new Date(filter.end) : true)
      // filter city
      .filter((concert) => filter.city
        ? concert.city === filter.city
        : this.getCitiesForCountry(this.authenticatedUser.location)?.includes(concert.city))
      // always sorted by begin
      .sort((a, b) => a.begin.getTime() - b.begin.getTime())
  }

  private getCitiesForCountry(country: Country) {
    return countryCityLocations.get(country);
  }

  private randomHttpDelay(): number {
    return 250 + (Math.random() * 100);
  }
}
