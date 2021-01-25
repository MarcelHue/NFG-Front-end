import {Component, OnInit} from '@angular/core';
import {TypeService} from '../../service/type.service';
import {Type} from '../../../Models/types';
import {MatDialogRef} from '@angular/material/dialog';
import {GenreService} from '../../service/genre.service';
import {Genre} from '../../../Models/Genre';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  types: Type[];
  genre: Genre[];
  typeId: string;
  movie = {
    title: undefined,
    description: undefined,
    year: undefined,
    userId: undefined,
    typeId: undefined,
    genreId: undefined

  };


  constructor(
    private typeService: TypeService,
    private genreService: GenreService,
    public dialogRef: MatDialogRef<AddMovieComponent>,
  ) {
  }

  ngOnInit(): void {
    this.typeService.getTypes().subscribe(type => this.types = type);
    this.genreService.getGenres().subscribe(genre => this.genre = genre);

  }


}
