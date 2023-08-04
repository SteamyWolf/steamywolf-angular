import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  form: FormGroup;
  selectedFile: string | ArrayBuffer;
  loading: boolean = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addOnBlur: boolean = true;
  subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(2),
      ]),
      description: new FormControl(''),
      tags: new FormControl([], Validators.maxLength(20)),
      nsfw: new FormControl('', Validators.required),
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our tag
    if (value) {
      const tags = this.form.controls['tags'].value;
      this.form.controls['tags'].setValue([...tags, value]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    const index = this.form.controls['tags'].value.indexOf(tag);
    if (index >= 0) {
      const tags = [...this.form.controls['tags'].value];
      tags.splice(index, 1);
      this.form.controls['tags'].setValue(tags);
    }
  }

  upload() {
    this.loading = true;
    this.subscriptions.push(
      this.authService
        .upload(
          this.selectedFile,
          this.form.controls['title'].value.trim(),
          this.form.controls['description'].value,
          this.form.controls['tags'].value,
          this.form.controls['nsfw'].value
        )
        .subscribe(
          (data: any) => {
            this.loading = false;
            this.form.controls['title'].reset(),
            this.form.controls['description'].reset(), // prettier-ignore
            this.selectedFile = ''; //prettier-ignore
            if (data.message === 'Successfully uploaded image') {
              // add snackbar from material
              this._snackBar.open('Successfully uploaded post! It may take a minute or two to see it in your account page.', 'X', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: 'successful-snack',
                duration: 5000,
              });
              this.router.navigate(['post', data.newPost.id]);
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
        )
    );
  }

  fileAdded(file: any) {
    const checkedFileStatus = this.checkFileType(file);
    if (!checkedFileStatus.status) {
      if (checkedFileStatus.type === 'incorrectFile') {
        this.incorrectFileTypeSnack();
      }
      if (checkedFileStatus.type === 'tooLarge') {
        this.fileTooLargeSnack();
      }
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file.target.files[0]);
    reader.onloadend = () => {
      if (!reader.result) return;
      this.selectedFile = reader.result;
    };
  }

  fileDropped(file: File) {
    const checkedFileStatus = this.checkFileType(file);
    if (!checkedFileStatus.status) {
      if (checkedFileStatus.type === 'incorrectFile') {
        this.incorrectFileTypeSnack();
      }
      if (checkedFileStatus.type === 'tooLarge') {
        this.fileTooLargeSnack();
      }
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (!reader.result) return;
      this.selectedFile = reader.result;
    };
  }

  checkFileType(file: File | any) {
    let reducedFile: File;
    if (file?.target?.files.length) {
      reducedFile = file.target.files[0];
    } else {
      reducedFile = file;
    }

    if (
      reducedFile.type !== 'image/jpeg' &&
      reducedFile.type !== 'image/png' &&
      reducedFile.type !== 'image/gif' &&
      reducedFile.type !== 'image/jpg'
    ) {
      this.incorrectFileTypeSnack();
      return { status: false, type: 'incorrectFile' };
    }

    const sizeInMB = parseFloat((reducedFile.size / (1024 * 1024)).toFixed(2));
    if (sizeInMB > 10) {
      return { status: false, type: 'tooLarge' };
    } else {
      return { status: true };
    }
  }

  fileTooLargeSnack() {
    // make form invalid
    this._snackBar.open('File is too large', 'X', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'error-snack',
      duration: 5000,
    });
  }

  incorrectFileTypeSnack() {
    this._snackBar.open('File is not the correct type', 'X', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'error-snack',
      duration: 5000,
    });
  }
}
