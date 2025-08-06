import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {getEnumValues} from '../../shared/utils/enum';
import {City} from '../../model/city';
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  imports: [
    RouterLink,
    FormsModule,
    NgTemplateOutlet,
  ],
  styleUrls: ['./home-page.css']
})
export class HomePage {

  private readonly cd = inject(ChangeDetectorRef);

  private timeout: any = null;

  scheduleCheck() {
    if(!this.timeout) {
      this.timeout = setTimeout(() => {
        this.cd.markForCheck();
        this.timeout = null;
      })
    }
  }

  isValidJson(val: string) {
    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }

  parseJson(val: string) {
    try {
      return JSON.parse(val);
    } catch (e) {
      return {}
    }
  }

  protected readonly getEnumValues = getEnumValues;
  protected readonly City = City;
}
