import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Type} from '../../Models/types';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  typeUrls = `https://localhost:5001/Types`;

  constructor(private http: HttpClient) {
  }

  getTypes(): Observable<Type[]> {
    return this.http.get<Type[]>(this.typeUrls);
  }

  getType(TID: string): Observable<Type> {
    return this.http.get<Type>(`${this.typeUrls}/${TID}`);
  }

}
