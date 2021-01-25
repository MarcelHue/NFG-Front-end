import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Movie} from '../../../Models/Movie';
import {TypeService} from '../../service/type.service';
import {Type} from '../../../Models/types';
import {Genre} from '../../../Models/Genre';
import {GenreService} from '../../service/genre.service';

@Component({
  selector: 'app-update-movie',
  templateUrl: './update-movie.component.html',
  styleUrls: ['./update-movie.component.css']
})
export class UpdateMovieComponent implements OnInit {
  types: Type[];
  typeId: string;
  genre: Genre[];

  constructor(
    private typeService: TypeService,
    private genreService: GenreService,
    public dialogRef: MatDialogRef<UpdateMovieComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Movie
  ) {
  }

  ngOnInit(): void {
    this.typeService.getTypes().subscribe(type => this.types = type);
    this.genreService.getGenres().subscribe(genre => this.genre = genre);
  }
}
