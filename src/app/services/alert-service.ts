import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AlertMode = 'info' | 'success' | 'failed';

export interface AlertMessage {
  id: number;
  text: string;
  mode: AlertMode;
}

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    private _alerts = new BehaviorSubject<AlertMessage[]>([]);
    alerts$ = this._alerts.asObservable();

    private _idCounter = 1;

    constructor() {
        // this.show('test test test test test', 'info')
        // this.show('test test test test test', 'success')
        // this.show('test test test test test', 'failed')
    }

    show(text: string, mode: AlertMode = 'info') {
        const alert: AlertMessage = {
            id: this._idCounter++,
            text,
            mode
        };

        const current = this._alerts.value;
        this._alerts.next([alert, ...current]);

        // auto remove after 10 seconds
        setTimeout(() => {
            this.remove(alert.id);
        }, 5000);
    }

    remove(id: number) {
        const current = this._alerts.value;
        this._alerts.next(current.filter(x => x.id !== id));
    }

    clear() {
        this._alerts.next([]);
    }
}