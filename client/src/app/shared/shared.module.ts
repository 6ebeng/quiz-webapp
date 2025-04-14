import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FilterPipe } from './filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortPipe } from './sort.pipe';

@NgModule({ declarations: [
        NavbarComponent,
        FooterComponent,
        FilterPipe,
        SortPipe,
    ],
    exports: [NavbarComponent, FooterComponent, FilterPipe, SortPipe, FormsModule, ReactiveFormsModule], imports: [CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class SharedModule { }
