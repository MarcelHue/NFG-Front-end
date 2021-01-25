import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Movie} from '../../Models/Movie';
import {AuthenticationService} from './authentication.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class MovieService {
  movieUrls = `https://localhost:5001/Movies`;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {
  }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.movieUrls);
  }

  getMovie(MID: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.movieUrls}/${MID}`, httpOptions);
  }

  addMovie(movie: Movie): Observable<Movie> {
    movie.userId = this.authenticationService.currentUserValue.id;
    return this.http.post<Movie>(this.movieUrls, movie, httpOptions);
  }

  deleteMovie(movie: Movie): Observable<Movie> {
    return this.http.delete<Movie>(`${this.movieUrls}/${movie.id}`, httpOptions);
  }

  updateMovie(movie: Movie): Observable<Movie> {
    const updateMovie = {
      title: movie.title,
      description: movie.description,
      year: movie.year,
      userId: this.authenticationService.currentUserValue.id,
      typeId: movie.typeId,
      genreId: movie.genreId,
    };
    return this.http.put<Movie>(`${this.movieUrls}/${movie.id}`, updateMovie, httpOptions);
  }
}
