import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { retry } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  activeTab: 'login' | 'register' = 'login';

  loginUsername: string = '';
  loginPassword: string = '';
  loginError: string = '';

  regUsername: string = '';
  regPassword: string = '';
  regConfirm: string = '';
  regError: string = '';
  regSuccess: string = '';


  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  login() {
    if (!this.loginUsername || !this.loginPassword) {
      this.loginError = 'Please enter both username and password.';
      return;
    }
    this.auth.login(this.loginUsername, this.loginPassword).subscribe({
      next: (user) => {
        this.auth.setUser(user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loginError = 'Invalid username or password.';
      }
    });
  }

  register() {
    this.regError = '';
    this.regSuccess = '';

    if (!this.regUsername || !this.regPassword) {
      this.regError = 'Please fill in all fields.';
      return;
    }

    if (this.regPassword !== this.regConfirm) {
      this.regError = 'Passwords do not match.';
      return;
    }

    const passwordErrors = this.validatePassword(this.regPassword);
    if (passwordErrors) {
      this.regError = passwordErrors;
      return;
    }

    this.auth.register(this.regUsername, this.regPassword).subscribe({
      next: () => {
        this.regSuccess = 'Account created! You can now sign in.';
        this.regUsername = '';
        this.regPassword = '';
        this.regConfirm = '';
        setTimeout(() => this.activeTab = 'login', 1500);
      },
      error: (err) => {
        this.regError = err.status === 409
          ? 'Username already exists.'
          : 'Registration failed. Try again.';
      }
    });
  }

  validatePassword(password: string): string | null {
    if (password.length < 8)
      return 'Password must be at least 8 characters.';

    if (!/[A-Z]/.test(password))
      return 'Password must contain at least one uppercase letter.';

    if (!/[a-z]/.test(password))
      return 'Password must contain at least one lowercase letter.';

    if (!/[0-9]/.test(password))
      return 'Password must contain at least one number.';

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      return 'Password must contain at least one special character (!@#$%...).';

    return null;  
  }

}