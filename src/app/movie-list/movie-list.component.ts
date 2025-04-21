import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/core/services/movie.service';
import { Movie } from 'src/app/core/models/movie.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  currentPage = 0;
  selectedYear?: number;
  selectedWinner?: string;
  yearFilter: string = '';
  winnerFilter: string = '';
  allMovies: Movie[] = [];
  yearFilterChanged = new Subject<string>();
  filteredMovies: Movie[] = []; 
  totalPages: number = 1;
  pagesToShow: (number | string)[] = [];
  page: number = 0;  
  pageSize: number = 10;  
  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.currentPage = 0;
    this.loadMovies();
  }

  updatePagination(): void {
    const total = this.totalPages;
    const current = this.currentPage;

    const pages = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, '...', total);
      } else if (current >= total - 2) {
        pages.push(1, '...', total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current, '...', total);
      }
    }

    this.pagesToShow = pages;
  }

  loadMovies(): void {

    const pageToSend = Math.max(this.currentPage - 1, 0);


    this.movieService
      .getMoviesPaginated(
        pageToSend,
        this.pageSize,
        this.selectedYear,
        this.selectedWinner
      )
      .subscribe(data => {
        this.movies = data.content;
        this.totalPages = data.totalPages;
        this.updatePagination();
      });
  }

  goToPage(page: number | string): void {
    if (page === '...' || typeof page !== 'number') return;
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.loadMovies();
  }


  applyFilters(): void {
    this.movies = this.allMovies.filter(movie => {
      const yearMatch = this.yearFilter ? movie.year.toString().includes(this.yearFilter) : true;
      const winnerMatch = this.winnerFilter
        ? this.winnerFilter === 'yes'
          ? movie.winner === true
          : movie.winner === false
        : true;
      return yearMatch && winnerMatch;
    });
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadMovies();
  }

  onYearFilterChange(event: Event): void {
    const value = (event.target as HTMLInputElement)?.value;
    this.selectedYear = value ? parseInt(value, 10) : undefined;
    this.currentPage = 0;
    this.loadMovies();
  }


  onWinnerFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement)?.value;
    this.selectedWinner = value === 'yes' ? 'yes' : value === 'no' ? 'no' : undefined;
    this.currentPage = 1; 
    this.loadMovies();
  }

  changePage(page: number): void {
    if (page < 0) {
      return;
    }
    this.currentPage = page;
    this.loadMovies(); 
  }

  nextPage(): void {
    this.currentPage++;
    this.loadMovies();
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadMovies();
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

}
