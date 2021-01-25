import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Movie} from '../../../Models/Movie';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MovieService} from '../../service/movie.service';
import {TypeService} from '../../service/type.service';
import {GenreService} from '../../service/genre.service';
import {UserService} from '../../service/user.service';
import {AuthenticationService} from '../../service/authentication.service';
import {User} from '../../../Models/Users';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})

export class FavoritesComponent implements OnInit {
  displayedColumns: string[] = ['title', 'description', 'year', 'type.name', 'genre', 'username', 'favorite'];
  movieList: MatTableDataSource<Movie>;
  selection = new SelectionModel<Movie>(true, []);
  user: User;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private movieService: MovieService,
    private typeService: TypeService,
    private genreService: GenreService,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    this.userService.getSingleUser(this.authenticationService.currentUserValue.id).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    let movies: Movie[] = [];
    this.userService.getSingleUser(this.authenticationService.currentUserValue.id).subscribe(user => {
      user.favorites.forEach(favId => {
          this.movieService.getMovie(favId).subscribe(movie => {
              if (movies.length === 0) {
                movies = [movie];
              } else {
                movies.push(movie);
              }
              this.movieList = new MatTableDataSource(this.editTable(movies));
              this.movieList.paginator = this.paginator;
              this.movieList.sort = this.sort;
            },
            error1 => {

              user.favorites.splice(user.favorites.indexOf(favId), 1);
              this.userService.favoritesUser(user);
            });
        }
      );
    });

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.movieList.filter = filterValue.trim().toLowerCase();

    if (this.movieList.paginator) {
      this.movieList.paginator.firstPage();
    }
  }

  editTable(movies: Movie[]): Movie[] {
    movies.forEach(ele => {
      if (ele.typeId) {
        this.typeService.getType(ele.typeId).subscribe(data => ele.typeId = data.name);
        ele.typeId = '';
      }
      if (ele.genreId) {
        const list = [];
        this.genreService.getGenres().subscribe(genre => {
          ele.genreId.forEach(genreID => {
            if (!genre.find(g => g.id === genreID)) {
              list.push(' ' + genreID);
            } else {
              list.push(' ' + genre.find(g => g.id === genreID).name);
            }
          });
          ele.genreId = list;
        });
      }
      if (ele.userId) {
        this.userService.getSingleUser(ele.userId).subscribe(user => {
          ele.userId = user.firstname;
        });
      }
      this.userService.getSingleUser(this.authenticationService.currentUserValue.id).subscribe(user => {
        if (user.favorites.find(id => ele.id === id)) {
          this.selection.select(movies[movies.indexOf(ele)]);
        }
      });
    });
    return movies;
  }

  fav(movie: Movie): void {
    this.userService.getSingleUser(this.authenticationService.currentUserValue.id).subscribe(user => {
      if (!user.favorites) {
        user.favorites = [movie.id];
      }
      if (user.favorites) {
        if (user.favorites.find(id => movie.id === id)) {
          user.favorites.splice(user.favorites.indexOf(movie.id), 1);
        } else {
          user.favorites.push(movie.id);
        }
      }
      this.userService.favoritesUser(user);
    });
  }
}
