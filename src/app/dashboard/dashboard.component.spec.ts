import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MovieService } from 'src/app/core/services/movie.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms'; // ✅ importar FormsModule

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;

  beforeEach(async () => {
    movieServiceSpy = jasmine.createSpyObj('MovieService', [
      'getProducersIntervals',
      'getTopStudios',
      'getYearsWithMultipleWinners',
      'getWinnersByYear'
    ]);

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [FormsModule], // ✅ adicionar aqui
      providers: [{ provide: MovieService, useValue: movieServiceSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should call loadProducerIntervals on ngOnInit', () => {
    spyOn(component, 'loadProducerIntervals').and.callThrough();

    // Mocks para evitar erro no ngOnInit
    movieServiceSpy.getProducersIntervals.and.returnValue(of({ min: [], max: [] }));
    movieServiceSpy.getTopStudios.and.returnValue(of([]));
    movieServiceSpy.getYearsWithMultipleWinners.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.loadProducerIntervals).toHaveBeenCalled();
    expect(movieServiceSpy.getProducersIntervals).toHaveBeenCalled();
  });
});
