import {Component, inject, OnInit, signal} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationStart, Router, RouterLink, RouterOutlet} from '@angular/router';
import {Backend} from './backend/backend';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly backend = inject(Backend);
  private readonly router = inject(Router);

  $user = toSignal(this.backend.getAuthenticatedUser$());


  ngOnInit() {
    this.initRouterLogs();
  }

  private initRouterLogs() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart
      || event instanceof NavigationCancel
      || event instanceof NavigationEnd)
    ).subscribe(console.log);
  }
}
