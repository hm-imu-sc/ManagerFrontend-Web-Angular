import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertService, AlertMessage } from '../../services/alert-service';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-alert-box',
    imports: [CommonModule],
    templateUrl: './alert-box.html',
    styleUrl: './alert-box.css',
})
export class AlertBox {

    alerts$: Observable<AlertMessage[]>;

    constructor(private alertService: AlertService) {
        this.alerts$ = this.alertService.alerts$;
    }

    close(id: number) {
        this.alertService.remove(id);
    }
}
