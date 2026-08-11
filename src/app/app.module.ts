import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntityExtractionComponent } from './components/entity-extraction/entity-extraction.component';
import { TextSimilarityComponent } from './components/text-similarity/text-similarity.component';
import { LanguageDetectionComponent } from './components/language-detection/language-detection.component';
import { SentimentAnalysisComponent } from './components/sentiment-analysis/sentiment-analysis.component';
import { HomeComponent } from './components/home/home.component';
import { HistoryComponent } from './components/history/history.component';
import { NavComponent } from './components/nav/nav.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { FormsModule } from '@angular/forms';
import {LoggerInterceptor} from "./services/logger.interceptor";

@NgModule({ declarations: [
        AppComponent,
        EntityExtractionComponent,
        TextSimilarityComponent,
        LanguageDetectionComponent,
        SentimentAnalysisComponent,
        HomeComponent,
        NavComponent,
        HistoryComponent,
        NotificationsComponent
    ],
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
        AppRoutingModule,
        FormsModule], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoggerInterceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
