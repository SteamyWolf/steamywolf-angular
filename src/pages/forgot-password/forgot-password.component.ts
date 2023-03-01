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
      email: new FormControl('', Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.susbscriptions.forEach((sub) => sub.unsubscribe());
  }

  submitForm() {
    this.susbscriptions.push(
      this.authService
        .forgotUserPasswordRequest(
          this.forgotPasswordForm.controls['email'].value
        )
        .subscribe({
          next: (value: any) => {
            console.log(value);
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
          },
        })
    );
  }
}
