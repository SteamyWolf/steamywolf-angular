import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  submissions: number = 0;
  pageSlice: any[] = [];
  hasQuery: boolean = false;
  query: string = '';
  @ViewChild('paginator') paginator: MatPaginator;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.params);
    if (!this.route.snapshot.params['query']) {
      this.hasQuery = false;
      this.authService.getCountOfAllSubmission().subscribe(
        (count: any) => {
          this.submissions = +count;
        },
        (err) => {
          console.log(err);
        }
      );

      this.authService.getPageRequestedSubmissions(0, 10).subscribe(
        (data: any) => {
          this.pageSlice = data;
        },
        (err) => {
          console.log(err);
        }
      );
    }
    if (this.route.snapshot.params['query']) {
      this.hasQuery = true;
      this.query = this.route.snapshot.params['query'];
      this.authService
        .getCountOfSearchedQuery(this.route.snapshot.params['query'])
        .subscribe({
          next: (value) => {
            console.log(value);
            this.submissions = +value;
          },
          error: (error) => {
            console.log(error);
          },
        });

      this.authService
        .getSearchQueryRequestedSubmissions(
          this.route.snapshot.params['query'],
          0,
          10
        )
        .subscribe({
          next: (value: any) => {
            console.log(value);
            this.pageSlice = value;
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.paginator.nextPage();
    }
    if (event.key === 'ArrowLeft') {
      this.paginator.previousPage();
    }
  }

  postNavigate(id: number) {
    this.router.navigate(['post', id]);
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;

    if (!this.hasQuery) {
      this.authService
        .getPageRequestedSubmissions(startIndex, event.pageSize)
        .subscribe((data: any) => {
          this.pageSlice = data;
        });
    }
    if (this.hasQuery) {
      this.authService
        .getSearchQueryRequestedSubmissions(
          this.query,
          startIndex,
          event.pageSize
        )
        .subscribe({
          next: (value: any) => {
            this.pageSlice = value;
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }
}
