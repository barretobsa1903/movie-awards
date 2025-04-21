// movie.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly API_URL = 'https://challenge.outsera.tech/api/movies';

  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<Movie[]> {
    return this.http.get<{ content: Movie[] }>(this.API_URL).pipe(
      map(response => response.content)
    );
  }

  getMoviesPaginated(
    page: number,
    size: number,
    year?: number,
    winner?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    if (year) {
      params = params.set('year', year.toString());
    }
  
    if (winner) {
      params = params.set('winner', winner);
    }
  
    return this.http.get<any>(`${this.API_URL}`, { params });
  }
  
  

  getYearsWithMultipleWinners(): Observable<{ year: number; winnerCount: number }[]> {
    return this.http.get<{ years: { year: number; winnerCount: number }[] }>(`${this.API_URL}?projection=years-with-multiple-winners`).pipe(
      map(response => response.years)
    );
  }

  getTopStudios(): Observable<{ studio: string; winCount: number }[]> {
    return this.http.get<{ studios: { name: string; winCount: number }[] }>(`${this.API_URL}?projection=studios-with-win-count`).pipe(
      map(response => response.studios
        .map(s => ({ studio: s.name, winCount: s.winCount }))
        .slice(0, 3) 
      )
    );
  }
  

  getProducersIntervals(): Observable<any> {
    return this.http.get<{ min: any[]; max: any[] }>(`${this.API_URL}?projection=max-min-win-interval-for-producers`).pipe(
      map(response => ({
        min: response.min, 
        max: response.max  
      }))
    );
  }
  

  getWinnersByYear(year: number): Observable<Movie[]> {
    const params = new HttpParams()
      .set('winner', 'true')
      .set('year', year.toString());
  
    return this.http.get<Movie[]>(`${this.API_URL}`, { params });
  }
}
