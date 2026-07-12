import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  selectedPage: string = 'employees';
  currentLang: string = 'en';

  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  onPageChange(event: Event) {
                    //event.target is the <select>
    const value = (event.target as HTMLSelectElement).value;
    this.selectedPage = value;
    this.router.navigate([`/${value}`]);
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);           
  }

  goHome() {
    this.router.navigate(['/employees']);
  }
}
