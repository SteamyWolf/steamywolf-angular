import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  submissions: number = 0;
  pageSlice: any[] = [];
  @ViewChild('paginator') paginator: MatPaginator;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getCountOfAllSubmission().subscribe((count: any) => {
      this.submissions = +count;
    });

    this.authService
      .getPageRequestedSubmissions(0, 10)
      .subscribe((data: any) => {
        this.pageSlice = data;
      });
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event);
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

    this.authService
      .getPageRequestedSubmissions(startIndex, event.pageSize)
      .subscribe((data: any) => {
        this.pageSlice = data;
      });
  }
}
