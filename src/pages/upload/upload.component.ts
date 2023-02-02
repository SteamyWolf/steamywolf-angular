import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  selectedFile: string | ArrayBuffer;
  title: string = '';
  description: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  upload() {
    this.loading = true;
    this.authService
      .upload(this.selectedFile, this.title, this.description)
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.title = '';
          this.description = '';
          this.selectedFile = '';
          console.log(data);
          if (data.message === 'Successfully uploaded image') {
            // add snackbar from material
            this._snackBar.open('Successfully uploaded post!', 'X', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: 'successful-snack',
              duration: 5000,
            });
          }
        },
        (err) => {
          this.loading = false;
          if (err.error.message === 'Token does not exist or has expired') {
            this._snackBar.open(
              'Please sign in again. Your session has expired.',
              'X',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: 'error-snack',
                duration: 5000,
              }
            );
            this.router.navigate(['/login']);
          } else {
            this._snackBar.open(
              'There was an unexpected error while trying to upload. Please try again',
              'X',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: 'error-snack',
                duration: 5000,
              }
            );
          }
        }
      );
  }

  fileAdded(file: any) {
    console.log(file.target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(file.target.files[0]);
    reader.onloadend = () => {
      if (!reader.result) return;
      this.selectedFile = reader.result;
    };
  }

  fileDropped(file: File) {
    console.log(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (!reader.result) return;
      this.selectedFile = reader.result;
    };
  }
}
