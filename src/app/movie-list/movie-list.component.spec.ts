import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieListComponent } from './movie-list.component';
import { MovieService } from 'src/app/core/services/movie.service';
import { of } from 'rxjs';
import { Movie } from 'src/app/core/models/movie.model';

describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;
  let movieService: jasmine.SpyObj<MovieService>;

  beforeEach(async () => {
    const movieServiceSpy = jasmine.createSpyObj('MovieService', ['getMoviesPaginated']);

    await TestBed.configureTestingModule({
      declarations: [ MovieListComponent ],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;

    // Configurar a resposta do serviço
    const mockMovies: Movie[] = [
      { id: 1, title: 'Movie A', year: 2000, winner: true, studios: [], producers: [] },
      { id: 2, title: 'Movie B', year: 2000, winner: false, studios: [], producers: [] }
    ];

    movieService.getMoviesPaginated.and.returnValue(of({ content: mockMovies, totalPages: 3 }));
  });

  // Teste 1: Verificar se o método loadMovies carrega filmes corretamente
  it('should load movies correctly', () => {
    component.loadMovies();
    expect(component.movies.length).toBe(2);
    expect(component.movies[0].title).toBe('Movie A');
    expect(movieService.getMoviesPaginated).toHaveBeenCalledWith(0, 10, undefined, undefined);
  });

  // Teste 2: Verificar se a paginação é atualizada corretamente
  it('should update pagination correctly', () => {
    component.totalPages = 10;
    component.currentPage = 4;
    component.updatePagination();
    expect(component.pagesToShow).toEqual([1, '...', 4, '...', 10]);
  });

  // Teste 3: Verificar se o filtro de ano funciona corretamente
  it('should apply year filter correctly', () => {
    component.yearFilter = '2000';
    component.allMovies = [
      { id: 1, title: 'Movie A', year: 2000, winner: true, studios: [], producers: [] },
      { id: 2, title: 'Movie B', year: 2001, winner: true, studios: [], producers: [] }
    ];

    component.applyFilters();
    expect(component.movies.length).toBe(1);
    expect(component.movies[0].title).toBe('Movie A');
  });

  // Teste 4: Verificar se o método nextPage atualiza a página corretamente
  it('should go to next page when nextPage is called', () => {
    component.currentPage = 0;
    component.totalPages = 5;
    component.nextPage();
    expect(component.currentPage).toBe(1);
    expect(movieService.getMoviesPaginated).toHaveBeenCalledWith(0, 10, undefined, undefined);
  });

  // Teste 5: Verificar se o método prevPage atualiza a página corretamente
  it('should go to previous page when prevPage is called', () => {
    component.currentPage = 1;
    component.totalPages = 5;
    component.prevPage();
    expect(component.currentPage).toBe(0);
    expect(movieService.getMoviesPaginated).toHaveBeenCalledWith(0, 10, undefined, undefined);
  });

  // Teste 8: Verificar se o método goToPage navega para a página correta
  it('should navigate to a specific page when goToPage is called', () => {
    component.totalPages = 5;
    component.goToPage(3);
    expect(component.currentPage).toBe(3);
    expect(movieService.getMoviesPaginated).toHaveBeenCalledWith(2, 10, undefined, undefined);
  });

  // Teste 9: Verificar se o método onFilterChange chama o método loadMovies
  it('should call loadMovies when onFilterChange is called', () => {
    spyOn(component, 'loadMovies');
    component.onFilterChange();
    expect(component.loadMovies).toHaveBeenCalled();
  });

  // Teste 10: Verificar se a navegação para a página funciona corretamente com a função changePage
  it('should change page when changePage is called', () => {
    component.changePage(2);
    expect(component.currentPage).toBe(2);
    expect(movieService.getMoviesPaginated).toHaveBeenCalledWith(1, 10, undefined, undefined);
  });
});
