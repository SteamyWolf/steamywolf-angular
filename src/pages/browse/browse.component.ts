import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit, OnDestroy {
  submissions: number = 0;
  pageSlice: any[] = [];
  hasQuery: boolean = false;
  query: string = '';
  currentUser: any;
  subscriptions: Subscription[] = [];

  startIndex: number = 0;
  pageSize: number = 10;
  @ViewChild('paginator') paginator: MatPaginator;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.currentUser.subscribe({
        next: (value: any) => {
          this.currentUser = value;
          if (!this.route.snapshot.params['query']) {
            this.hasQuery = false;
            this.subscriptions.push(
              this.authService
                .getCountOfAllSubmissions(
                  this.currentUser?.nsfw_checked || false
                )
                .subscribe(
                  (count: any) => {
                    console.log(count)
                    this.submissions = +count;
                  },
                  (err) => {
                    console.log(err);
                  }
                )
            );

            this.subscriptions.push(
              this.authService
                .getPageRequestedSubmissions(
                  this.startIndex,
                  this.pageSize,
                  this.currentUser?.nsfw_checked || false
                )
                .subscribe(
                  (data: any) => {
                    this.pageSlice = data;
                  },
                  (err) => {
                    console.log(err);
                  }
                )
            );
          }
          if (this.route.snapshot.params['query']) {
            this.hasQuery = true;
            this.query = this.route.snapshot.params['query'];
            this.subscriptions.push(
              this.authService
                .getCountOfSearchedQuery(
                  this.route.snapshot.params['query'],
                  this.currentUser?.nsfw_checked || false
                )
                .subscribe({
                  next: (value) => {
                    this.submissions = +value;
                  },
                  error: (error) => {
                    console.log(error);
                  },
                })
            );

            this.subscriptions.push(
              this.authService
                .getSearchQueryRequestedSubmissions(
                  this.route.snapshot.params['query'],
                  this.startIndex,
                  this.pageSize,
                  this.currentUser?.nsfw_checked || false
                )
                .subscribe({
                  next: (value: any) => {
                    this.pageSlice = value;
                  },
                  error: (error) => {
                    console.log(error);
                  },
                })
            );
          }
        },
        error: (error) => console.log(error),
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
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
    this.startIndex = startIndex;
    this.pageSize = event.pageSize;

    if (!this.hasQuery) {
      this.subscriptions.push(
        this.authService
          .getPageRequestedSubmissions(
            startIndex,
            event.pageSize,
            this.currentUser?.nsfw_checked || false
          )
          .subscribe((data: any) => {
            this.pageSlice = data;
          })
      );
    }
    if (this.hasQuery) {
      this.subscriptions.push(
        this.authService
          .getSearchQueryRequestedSubmissions(
            this.query,
            startIndex,
            event.pageSize,
            this.currentUser?.nsfw_checked || false
          )
          .subscribe({
            next: (value: any) => {
              this.pageSlice = value;
            },
            error: (error) => {
              console.log(error);
            },
          })
      );
    }
  }
}
