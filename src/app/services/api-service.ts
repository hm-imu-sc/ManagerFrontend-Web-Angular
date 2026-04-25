import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empty } from '../../constants';

export type GeneralResponse = {
    generalResponse: {
        isSuccess?: boolean,
        message?: string
    }
}

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    // baseUrl: string = 'http://192.168.0.29:3000'; // DummyDb
    // baseUrl: string = 'https://localhost:5000'; // devlopment 
    baseUrl: string = 'http://192.168.0.26:8500'; // deployment 
    // baseUrl: string = 'http://192.168.0.29:8500'; // devlopment(For Mobile)

    constructor(private http: HttpClient) {}

    async get<R>(api: string): Promise<R & GeneralResponse>  {
        type Response = R & GeneralResponse;
        return new Promise<Response>((resolve, reject) => {
            this.http
                .get<Response>(`${this.baseUrl}${api}`)
                .subscribe({
                    next: (response: Response) => {
                        if ((response.generalResponse.isSuccess ?? false) === false) {
                            reject(response.generalResponse.message ?? Empty.str);
                            return;
                        }
                        resolve(response)
                    },
                    error: err => reject(err.message ?? '')
                });
        });
    }

    async post<R>(api: string, body: any): Promise<R & GeneralResponse> {
        type Response = R & GeneralResponse;
        return new Promise<Response>((resolve, reject) => {
            this.http
                .post<Response>(`${this.baseUrl}${api}`, JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } })
                .subscribe({
                    next: (response: Response) => {
                        if ((response.generalResponse.isSuccess ?? false) === false) {
                            reject(response.generalResponse.message ?? Empty.str);
                            return;
                        }
                        resolve(response)
                    },
                    error: err => reject(err.message ?? '')
                });
        });
    }
}
