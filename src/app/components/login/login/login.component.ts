import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.error = 'Please enter username and password.';
      return;
    }

    this.auth.login(this.username, this.password).subscribe({
      next: (user) => {
        this.auth.setUser(user);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Invalid username or password.';
      }
    });
  }
}