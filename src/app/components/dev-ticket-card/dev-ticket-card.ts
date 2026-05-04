import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Badge } from "../generics/badge/badge";
import { DevTicket } from '../../types/DevTicket';
import { DevTicketService } from '../../services/dev-ticket-service';

@Component({
    selector: 'app-dev-ticket-card',
    imports: [DatePipe, Badge],
    templateUrl: './dev-ticket-card.html',
    styleUrl: './dev-ticket-card.css',
})
export class DevTicketCard implements OnInit {
    statusCorrespondingDate?: Date;

    @Input({ required: true })
    devTicket!: DevTicket;

    @Output()
    onClick = new EventEmitter<number>();

    constructor(public _devTicketService: DevTicketService) {}
    
    ngOnInit(): void {
        this.statusCorrespondingDate = this._devTicketService.getStatusCorrespondingDate(this.devTicket);
    }

    doClick(): void {
        this.onClick.emit(this.devTicket.id);
    }
}
