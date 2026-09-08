import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthResponse } from '../models/AuthResponse';
import { RoleModel } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUser: AuthResponse | null = null;

  constructor(private http: HttpClient, private router: Router) {
    const saved = localStorage.getItem('currentUser');
    if (saved) this.currentUser = JSON.parse(saved);
  }

  register(username: string, password: string, roleId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password, roleId });
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password });
  }

  getRoles(): Observable<RoleModel[]> {
    return this.http.get<RoleModel[]>(`${this.apiUrl}/roles`);
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  setUser(user: AuthResponse) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUser(): AuthResponse | null {
    return this.currentUser;
  }
  getToken(): string {
    return this.currentUser?.token ?? '';
  }
  isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }

  isManager(): boolean {
    return this.currentUser?.role === 'Manager';
  }

  isAdminOrManager(): boolean {
    return this.isAdmin() || this.isManager();
  }

  getRole(): string {
    return this.currentUser?.role ?? '';
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null && this.currentUser.token !== '';
  }

  clearUser() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}

