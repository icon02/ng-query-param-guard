import {ResolveFn} from '@angular/router';
import {City} from '../../../model/city';
import {inject} from '@angular/core';
import {Backend} from '../../../backend/backend';
import {take} from 'rxjs';

export const cityOptionsResolver: ResolveFn<City[]> = () => inject(Backend).getCitiesForAuthenticatedUser$().pipe(take(1))
