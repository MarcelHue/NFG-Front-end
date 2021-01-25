import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {GenreService} from '../../service/genre.service';
import {MovieService} from '../../service/movie.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {TypeService} from '../../service/type.service';
import {Movie} from '../../../Models/Movie';
import {Type} from '../../../Models/types';
import {UpdateMovieComponent} from '../update-movie/update-movie.component';
import {MatDialog} from '@angular/material/dialog';
import {AddMovieComponent} from '../add-movie/add-movie.component';
import {Genre} from '../../../Models/Genre';
import {UserService} from '../../service/user.service';
import {AuthenticationService} from '../../service/authentication.service';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-movies',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['title', 'description', 'year', 'type.name', 'genre', 'remove', 'update', 'username', 'favorite'];
  movieSource: MatTableDataSource<Movie>;
  movieList: MatTableDataSource<Movie>;
  types: Type[];
  genre: Genre[];
  list: string[];
  isLoading = true;
  selection = new SelectionModel<Movie>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private movieService: MovieService,
    private typeService: TypeService,
    private genreService: GenreService,
    private userService: UserService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.typeService.getTypes().subscribe(type => {
      this.types = type;
      this.genreService.getGenres().subscribe(genre => {
        this.genre = genre;
        this.loadMovies();
        this.isLoading = false;
      });
    });
  }

  reload(): void {
    this.movieService.getMovies().subscribe(movie => {
      movie = this.editTable(movie);
      this.movieList = new MatTableDataSource(movie);
      this.changeDetectorRefs.detectChanges();
    });
    this.movieService.getMovies().subscribe(movie => {
      this.movieSource = new MatTableDataSource(movie);
      this.changeDetectorRefs.detectChanges();
    });

  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe(movie => {
      this.movieList = new MatTableDataSource(this.editTable(movie));
      this.movieList.paginator = this.paginator;
      this.movieList.sort = this.sort;
    });
    this.movieService.getMovies().subscribe(movie => {
      this.movieSource = new MatTableDataSource(movie);
    });
  }

  editTable(movies: Movie[]): Movie[] {
    movies.forEach(movie => {
      if (movie.typeId) {
        movie.typeId = this.types.find(type => type.id === movie.typeId).name;
      }
      if (movie.genreId) {
        const list = [];
        movie.genreId.forEach(genre => list.push(' ' + this.genre.find(t => t.id === genre).name));
        movie.genreId = list;
      }
      if (movie.userId) {
        this.userService.getSingleUser(movie.userId).subscribe(user => {
          movie.userId = user.firstname;
        });
        movie.userId = '';
      }
      this.userService.getSingleUser(this.authenticationService.currentUserValue.id).subscribe(user => {
        if (user.favorites.find(id => movie.id === id)) {
          this.selection.select(movies[movies.indexOf(movie)]);
        }
      });

    });
    return movies;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.movieList.filter = filterValue.trim().toLowerCase();

    if (this.movieList.paginator) {
      this.movieList.paginator.firstPage();
    }
  }

  deleteMovie(movie: Movie): void {
    this.movieService.deleteMovie(movie).subscribe(t => {
      this.movieList.data.splice(this.movieList.data.indexOf(t), 1);
      this.reload();
    });
  }

  updateMovie(movie: Movie): void {
    const dialogRef = this.dialog.open(UpdateMovieComponent, {
      data: this.movieSource.data.find((t) => t.id === movie.id)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movieService.updateMovie(result).subscribe(t => {
          this.movieSource.data.push(t);
          this.reload();
        });
      }
    });
  }

  addMovie(): void {
    const dialogRef = this.dialog.open(AddMovieComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movieService.addMovie(result).subscribe(movie => {
          this.movieList.data.push(movie);
          this.reload();
        });
      }
    });
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
