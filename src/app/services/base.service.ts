import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class BaseService<T> {
  constructor(protected http: HttpClient, protected apiUrl: string) {}

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  add(item: T): Observable<any> {
    return this.http.post(this.apiUrl, item);
  }

  update(id: number, item: T): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}