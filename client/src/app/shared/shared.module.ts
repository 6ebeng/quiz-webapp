import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FilterPipe } from './filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    FilterPipe,
    
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule, 
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [NavbarComponent, FooterComponent, FilterPipe, FormsModule, ReactiveFormsModule]
})
export class SharedModule { }
