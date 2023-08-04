import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;
  susbscriptions: Subscription[] = [];
  constructor(
    private authService: AuthService,
    private _matSnack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnDestroy(): void {
    this.susbscriptions.forEach((sub) => sub.unsubscribe());
  }

  submitForm() {
    this._matSnack.open('Loading...', 'X', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'neutral-snack'
    });
    this.susbscriptions.push(
      this.authService.forgotUserPasswordRequest(this.forgotPasswordForm.controls['email'].value).subscribe({
          next: (value: any) => {
            this.forgotPasswordForm.reset();
            this._matSnack.open(value.message, 'X', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: 'successful-snack',
              duration: 5000,
            });
          },
          error: (error) => {
            console.error(error);
            if (error.error.message === "Error trying to send password request email") {
              this._matSnack.open('Issue sending over the email. Contact the site admin if this continues.', 'X', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: 'error-snack',
                duration: 5000,
              })
            } else {
              this._matSnack.open(
                'Email does not exist in the database. Please try again',
                'X',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  panelClass: 'error-snack',
                  duration: 5000,
                }
              );
            }
          },
          complete: () => {
            console.log('When is this being called?')
          }
        })
    );
  }
}
