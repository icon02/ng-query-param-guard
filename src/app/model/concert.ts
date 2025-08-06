import {Country} from './country';
import {City} from './city';

export interface Concert {
  name: string;
  country: Country;
  city: City;
  begin: Date;
  end: Date;
}
