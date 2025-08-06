import {Country} from '../../model/country';
import {City} from '../../model/city';

export const countryCityLocations = new Map<Country, City[]>([
    [Country.AUSTRIA, [City.GRAZ, City.VIENNA, City.LINZ, City.INNSBRUCK]],
    [Country.GERMANY, [City.MUNICH, City.BERLIN, City.COLOGNE, City.STUTTGART]],
    [Country.USA, [City.NEW_YORK, City.LOS_ANGELES, City.MIAMI, City.DALLAS]],
  ]
);

export const cityCountryLocations = new Map<City, Country>([
  [City.VIENNA, Country.AUSTRIA],
  [City.LINZ, Country.AUSTRIA],
  [City.GRAZ, Country.AUSTRIA],
  [City.INNSBRUCK, Country.AUSTRIA],

  [City.MUNICH, Country.GERMANY],
  [City.BERLIN, Country.GERMANY],
  [City.COLOGNE, Country.GERMANY],
  [City.STUTTGART, Country.GERMANY],

  [City.NEW_YORK, Country.USA],
  [City.LOS_ANGELES, Country.USA],
  [City.MIAMI, Country.USA],
  [City.DALLAS, Country.USA],
])
