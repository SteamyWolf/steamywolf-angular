import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgOptimizedImage } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from 'src/pages/home/home.component';
import { HeaderComponent } from 'src/components/header/header.component';
import { AccountComponent } from 'src/pages/account/account.component';
import { LoginComponent } from 'src/components/login/login.component';
import { UploadComponent } from 'src/pages/upload/upload.component';
import { DndDirective } from 'src/directives/dnd.directive';
import { PostComponent } from 'src/pages/post/post.component';
import { SignUpComponent } from 'src/pages/sign-up/sign-up.component';
import { BrowseComponent } from 'src/pages/browse/browse.component';
import { BlurhashModule } from 'ng-blurhash';
import { ForgotPasswordComponent } from 'src/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from 'src/pages/reset-password/reset-password.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    AccountComponent,
    LoginComponent,
    UploadComponent,
    DndDirective,
    PostComponent,
    SignUpComponent,
    BrowseComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    NgOptimizedImage,
    MatChipsModule,
    MatRadioModule,
    MatPaginatorModule,
    BlurhashModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
