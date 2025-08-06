import {Role} from './role';
import {Country} from './country';

export interface User {
  name: string;
  role: Role;
  location: Country;
}
