import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Train } from '../models/train.model';
import { BaseService } from './base.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RailwayService extends BaseService<Train> {

  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/trains`);  
  }

}