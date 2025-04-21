import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { Movie } from '../models/movie.model';

describe('MovieService - getMoviesPaginated', () => {
    let service: MovieService;
    let httpMock: HttpTestingController;

    const API_URL = 'https://challenge.outsera.tech/api/movies';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MovieService]
        });

        service = TestBed.inject(MovieService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should send correct params when only page and size are provided', () => {
        service.getMoviesPaginated(1, 20).subscribe();

        const req = httpMock.expectOne(request =>
            request.url === API_URL &&
            request.params.get('page') === '1' &&
            request.params.get('size') === '20' &&
            !request.params.has('year') &&
            !request.params.has('winner')
        );

        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    it('should include year param when provided', () => {
        service.getMoviesPaginated(2, 10, 1995).subscribe();

        const req = httpMock.expectOne(request =>
            request.url === API_URL &&
            request.params.get('year') === '1995'
        );

        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    it('should include winner param when provided', () => {
        service.getMoviesPaginated(0, 10, undefined, 'true').subscribe();

        const req = httpMock.expectOne(request =>
            request.url === API_URL &&
            request.params.get('winner') === 'true'
        );

        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    it('should include all params when all are provided', () => {
        service.getMoviesPaginated(3, 15, 2000, 'false').subscribe();

        const req = httpMock.expectOne(request =>
            request.url === API_URL &&
            request.params.get('page') === '3' &&
            request.params.get('size') === '15' &&
            request.params.get('year') === '2000' &&
            request.params.get('winner') === 'false'
        );

        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    it('should handle errors gracefully', () => {
        const errorMessage = 'Internal Server Error';

        service.getMoviesPaginated(1, 10).subscribe(
            data => fail('should have failed'),
            error => {
                expect(error.status).toBe(500);
                expect(error.error).toBe(errorMessage);
            }
        );

        const req = httpMock.expectOne(request => request.url === API_URL);
        req.flush(errorMessage, { status: 500, statusText: 'Error' });
    });
});

describe('MovieService - getYearsWithMultipleWinners', () => {
    let service: MovieService;
    let httpMock: HttpTestingController;
    const API_URL = 'https://challenge.outsera.tech/api/movies';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MovieService]
        });

        service = TestBed.inject(MovieService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should return years with winner count when response is valid', () => {
        const mockResponse = {
            years: [
                { year: 2000, winnerCount: 2 },
                { year: 2010, winnerCount: 3 }
            ]
        };

        service.getYearsWithMultipleWinners().subscribe(data => {
            expect(data.length).toBe(2);
            expect(data).toEqual(mockResponse.years);
        });

        const req = httpMock.expectOne(`${API_URL}?projection=years-with-multiple-winners`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should call the correct URL with projection parameter', () => {
        service.getYearsWithMultipleWinners().subscribe();

        const req = httpMock.expectOne(`${API_URL}?projection=years-with-multiple-winners`);
        expect(req.request.method).toBe('GET');
        req.flush({ years: [] });
    });

    it('should handle error response gracefully', () => {
        const errorMessage = 'Internal Server Error';

        service.getYearsWithMultipleWinners().subscribe({
            next: () => fail('Expected an error'),
            error: (error) => {
                expect(error.status).toBe(500);
                expect(error.statusText).toBe('Internal Server Error');
            }
        });

        const req = httpMock.expectOne(`${API_URL}?projection=years-with-multiple-winners`);
        req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
});

describe('MovieService - getTopStudios', () => {
    let service: MovieService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MovieService]
        });
        service = TestBed.inject(MovieService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should return top 3 studios correctly formatted', () => {
        const mockResponse = {
            studios: [
                { name: 'Studio A', winCount: 5 },
                { name: 'Studio B', winCount: 3 },
                { name: 'Studio C', winCount: 2 },
                { name: 'Studio D', winCount: 1 }
            ]
        };

        service.getTopStudios().subscribe({
            next: studios => {
                expect(studios.length).toBe(3);
                expect(studios[0]).toEqual({ studio: 'Studio A', winCount: 5 });
                expect(studios[1]).toEqual({ studio: 'Studio B', winCount: 3 });
                expect(studios[2]).toEqual({ studio: 'Studio C', winCount: 2 });
            }
        });

        const req = httpMock.expectOne(`${service['API_URL']}?projection=studios-with-win-count`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
        httpMock.verify();
    });

    it('should return fewer than 3 studios if response has less', () => {
        const mockResponse = {
            studios: [
                { name: 'Studio A', winCount: 5 },
                { name: 'Studio B', winCount: 3 }
            ]
        };

        service.getTopStudios().subscribe({
            next: studios => {
                expect(studios.length).toBe(2);
                expect(studios[1].studio).toBe('Studio B');
            }
        });

        const req = httpMock.expectOne(`${service['API_URL']}?projection=studios-with-win-count`);
        req.flush(mockResponse);
        httpMock.verify();
    });

    it('should handle error response', () => {
        service.getTopStudios().subscribe({
            next: () => fail('Expected error'),
            error: (error) => {
                expect(error.status).toBe(500);
                expect(error.statusText).toBe('Internal Server Error');
            }
        });

        const req = httpMock.expectOne(`${service['API_URL']}?projection=studios-with-win-count`);
        req.flush('Error occurred', { status: 500, statusText: 'Internal Server Error' });
        httpMock.verify();
    });
});

describe('MovieService - getProducersIntervals', () => {
    let service: MovieService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MovieService]
        });
        service = TestBed.inject(MovieService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should return min and max intervals correctly', () => {
        const mockResponse = {
            min: [{ producer: 'Producer A', interval: 1 }],
            max: [{ producer: 'Producer B', interval: 10 }]
        };

        service.getProducersIntervals().subscribe({
            next: result => {
                expect(result.min.length).toBe(1);
                expect(result.max.length).toBe(1);
                expect(result.min[0].producer).toBe('Producer A');
                expect(result.max[0].producer).toBe('Producer B');
            }
        });

        const req = httpMock.expectOne(`${service['API_URL']}?projection=max-min-win-interval-for-producers`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
        httpMock.verify();
    });

    it('should return empty arrays if API returns empty', () => {
        const mockResponse = {
            min: [],
            max: []
        };

        service.getProducersIntervals().subscribe({
            next: result => {
                expect(result.min).toEqual([]);
                expect(result.max).toEqual([]);
            }
        });

        const req = httpMock.expectOne(`${service['API_URL']}?projection=max-min-win-interval-for-producers`);
        req.flush(mockResponse);
        httpMock.verify();
    });

    it('should handle API error', () => {
        service.getProducersIntervals().subscribe({
            next: () => fail('Expected error'),
            error: error => {
                expect(error.status).toBe(500);
                expect(error.statusText).toBe('Internal Server Error');
            }
        });

        const req = httpMock.expectOne(`${service['API_URL']}?projection=max-min-win-interval-for-producers`);
        req.flush('Erro inesperado', { status: 500, statusText: 'Internal Server Error' });
        httpMock.verify();
    });
});

describe('MovieService - getWinnersByYear', () => {
    let service: MovieService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MovieService]
        });
        service = TestBed.inject(MovieService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should return movies for a given year', () => {
        const year = 2000;
        const mockMovies: Movie[] = [
            { id: 1, title: 'Movie A', year: 2000, winner: true, studios: [], producers: [] },
            { id: 2, title: 'Movie B', year: 2000, winner: true, studios: [], producers: [] }
        ];

        service.getWinnersByYear(year).subscribe({
            next: movies => {
                expect(movies.length).toBe(2);
                expect(movies[0].title).toBe('Movie A');
                expect(movies[1].year).toBe(2000);
            }
        });

        const req = httpMock.expectOne(`${service['API_URL']}?winner=true&year=2000`);
        expect(req.request.method).toBe('GET');
        req.flush(mockMovies);
        httpMock.verify();
    });

    it('should handle API error', () => {
        const year = 1999;

        service.getWinnersByYear(year).subscribe({
            next: () => fail('Expected an error'),
            error: error => {
                expect(error.status).toBe(404);
                expect(error.statusText).toBe('Not Found');
            }
        });

        const req = httpMock.expectOne(`${service['API_URL']}?winner=true&year=1999`);
        req.flush('Not Found', { status: 404, statusText: 'Not Found' });
        httpMock.verify();
    });
});