import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedIn: boolean = false;
  searchForm: FormGroup;
  currentUser: any = {};
  subscriptions: Subscription[] = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.userLoggedInState.subscribe({
        next: (value: boolean) => {
          this.loggedIn = value;
        },
        error: (error) => console.log(error),
      })
    );

    this.subscriptions.push(
      this.authService.currentUser.subscribe({
        next: (value: any) => {
          console.log(value);
          this.currentUser = value;
        },
        error: (error) => console.log(error),
      })
    );

    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.subscriptions.push(
      this.authService.logout().subscribe((response: any) => {
        this._snackBar.open('Successfully logged out', 'X', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'successful-snack',
          duration: 5000,
        });
        this.authService.userLoggedInState.next(false);
        this.authService.currentUser.next(null);
        this.navigateHome();
      })
    );
  }

  search() {
    if (this.router.url.includes('/browse/')) {
      this.router.navigate(['/'], { skipLocationChange: true }).then(() => {
        this.router.navigate([
          'browse',
          this.searchForm.controls['search'].value,
        ]);
      });
    } else {
      this.router.navigate([
        'browse',
        this.searchForm.controls['search'].value,
      ]);
    }
  }

  nsfwToggled(value: MatSlideToggleChange) {
    this.subscriptions.push(
      this.authService.updateNsfwChecked(value.checked).subscribe({
        next: (value: any) => {
          this.authService.currentUser.next(value.foundUser);
        },
        error: (error) => console.log(error),
      })
    );
  }
}
