/*
    가져다쓸때
    let result =  await this.api.post('/getStoreList', {owner_id:this.app.user.getOwnerID()} ).toPromise();
*/


import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { AppService } from './app.service';



const httpOptions = {
    // headers: new HttpHeaders({'Content-Type': 'application/json'})
};

// const endpoint = environment.api_endpoint;// "http://localhost:8080";
// const endpoint = "http://13.209.76.125:8080/v1/api";

@Injectable()
export class RestApiService {

    constructor(
        private http: HttpClient
    ) { }


    private handleError(error) {

        if (error && error.error instanceof ErrorEvent) {
            // alert("서버오류 : " + error.message);
            // A client-side or network error occurred. Handle it accordingly.
        } else {
            // alert("코드: " + error.error_number + ", 메세지: " + error.error_msg);
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
        }
        console.log(error);
        // return an observable with a user-facing error message
        return throwError(error);
    }

    private extractData(res: any) {
        //error
        if (res.status === 0) {
            throw res.error;
        }
        let body = res.data;
        return body || {};
    }




    post(uri, param) {
        const url = uri;
        console.log(url);
        return this.http.post(url, param, httpOptions).pipe(
            map(this.extractData), catchError(this.handleError));
    }


    get(uri) {
        const url = uri;
        console.log(url);
        return this.http.get(url).pipe(
            map(this.extractData), catchError(this.handleError));
    }

}


