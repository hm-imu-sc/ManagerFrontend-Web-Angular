import { Component, Input } from '@angular/core';
import { DevTicket } from '../../pages/app-manager/dev-tracker/dev-tracker';

@Component({
    selector: 'app-dev-ticket-editor',
    imports: [],
    templateUrl: './dev-ticket-editor.html',
    styleUrl: './dev-ticket-editor.css',
})
export class DevTicketEditor {
    @Input({ required: true })
    devTicket!: DevTicket;
}
