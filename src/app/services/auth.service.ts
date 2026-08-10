import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUser: UserModel | null = null;

  constructor(private http: HttpClient, private router: Router) {
                // reload from localStorage on refresh
    const saved = localStorage.getItem('currentUser');
    if (saved) this.currentUser = JSON.parse(saved);
  }

  login(username: string, password: string): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.apiUrl}/login`, { username, password });
  }

  setUser(user: UserModel) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUser(): UserModel | null {
    return this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}