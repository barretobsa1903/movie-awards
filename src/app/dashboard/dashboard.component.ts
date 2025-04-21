import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/core/services/movie.service';
import confetti from 'canvas-confetti'; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  yearsWithMultipleWinners: { year: number; winnerCount: number }[] = [];
  topStudios: { studio: string; winCount: number }[] = [];
  producerIntervalsMin: any;
  producerIntervalsMax: any;
  winnersByYear: any[] = [];
  selectedYear: number | null = null;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadYearsWithMultipleWinners();
    this.loadTopStudios();
    this.loadProducerIntervals();
  }

  loadYearsWithMultipleWinners() {
    this.movieService.getYearsWithMultipleWinners().subscribe(data => {
      this.yearsWithMultipleWinners = data;
    });
  }

  loadTopStudios() {
    this.movieService.getTopStudios().subscribe(data => {
      this.topStudios = data;
    });
  }

  loadProducerIntervals(): void {
    this.movieService.getProducersIntervals().subscribe(data => {
      this.producerIntervalsMin = data.min;
      this.producerIntervalsMax = data.max;
    });
  }

  onSearchWinnersByYear(): void {
    const year = Number(this.selectedYear);
    if (!year) {
      this.winnersByYear = [];
      return;
    }
  
    this.movieService.getWinnersByYear(year).subscribe({
      next: (data) => {this.winnersByYear = data;this.celebrate()},
      error: err => {
        console.error('Erro ao buscar vencedores por ano', err);
        this.winnersByYear = [];
      }
    });
  }

  celebrate() {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 1000
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (Math.random() + 0.5);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
    }, 250);
  }
}
