import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent{

  selectedPage: string = 'employees';

  constructor(private router: Router) {}

  onPageChange(event: Event) {
                  //event.target is the <select>
    const value = (event.target as HTMLSelectElement).value;
    this.selectedPage = value;
    this.router.navigate([`/${value}`]);
  }

   goHome() {
    this.router.navigate(['/employees']);
  }
}

