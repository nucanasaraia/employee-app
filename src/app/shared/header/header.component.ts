import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  selectedMain: string = 'dashboard';
  currentLang: string = 'en';
  isRailwayActive: boolean = false;   

  constructor(
    private router: Router,

    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => this.syncDropdown(e.urlAfterRedirects));

    this.syncDropdown(this.router.url);
  }

  syncDropdown(url: string) {
    if (url.includes('employees'))      this.selectedMain = 'employees';
    else if (url.includes('dashboard')) this.selectedMain = 'dashboard';
    else                                this.selectedMain = '';

    this.isRailwayActive = url.includes('railway');  
  }

  onMainChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value) this.router.navigate([`/${value}`]);
  }

  goToRailway() {
    this.router.navigate(['/railway']);
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}