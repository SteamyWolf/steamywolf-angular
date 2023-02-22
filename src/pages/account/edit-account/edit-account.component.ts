import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss'],
})
export class EditAccountComponent implements OnInit, OnDestroy {
  imageChangedEvent: any = '';
  croppedImage: string | null | undefined;
  userAddedAnImage: boolean = false;
  user: any;
  loading: boolean = false;

  @ViewChild('fileInput') fileInput: ElementRef;

  subscriptions: Subscription[] = [];
  constructor(
    private authService: AuthService,
    private matSnack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.currentUser.subscribe({
        next: (value: any) => {
          console.log(value);
          if (value) {
            this.user = value;
          }
        },
        error: (error: any) => {
          console.log(error);
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.userAddedAnImage = true;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
    this.matSnack.open('There was an error. Please try again', 'X', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'error-snack',
      duration: 5000,
    });
  }

  uploadAccountImage() {
    this.loading = true;
    this.subscriptions.push(
      this.authService
        .uploadNewUserThumbnail(
          this.croppedImage!,
          this.user.thumbnail.split('/')[7].split('.')[0]
        )
        .subscribe({
          next: (value: any) => {
            console.log(value);
            this.loading = false;
            this.user.thumbnail = value.thumbnail;
            console.log(this.fileInput);
            this.fileInput.nativeElement.value = '';
            this.userAddedAnImage = false;
            this.matSnack.open('Successfully updated account image', 'X', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: 'successful-snack',
              duration: 5000,
            });
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.matSnack.open(
              'There was an error changing the account image. Try again',
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
