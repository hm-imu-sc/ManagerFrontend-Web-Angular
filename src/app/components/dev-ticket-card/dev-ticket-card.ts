import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Badge, BadgeColorProfile } from "../badge/badge";
import { DevTicketStatuses } from '../../types/DevTicketStatuses';
import { DevTicket } from '../../types/DevTicket';
import { DevTicketPriorities } from '../../types/DevTicketPriority';

type DevTicketStatusInfo = {
    icon: string,
    color: string
}

export const DevTicketStatusTextMap = new Map<number, DevTicketStatusInfo>([
    [DevTicketStatuses[1].id /*New*/, {
        icon: 'far fa-sparkles',
        color: 'text-[dodgerblue]'
    }], 
    [DevTicketStatuses[2].id /*In Progress*/, {
        icon: 'fad fa-cog animate-spin',
        color: 'text-violet-700'
    }], 
    [DevTicketStatuses[3].id /*Done*/, {
        icon: 'far fa-check',
        color: 'text-green-700'
    }]
]);

@Component({
    selector: 'app-dev-ticket-card',
    imports: [DatePipe, Badge],
    templateUrl: './dev-ticket-card.html',
    styleUrl: './dev-ticket-card.css',
})
export class DevTicketCard implements OnInit {

    statusTextMap = DevTicketStatusTextMap;
    priorityColorMap = new Map<number, BadgeColorProfile>();
    statusCorrespondingDate?: Date;

    @Input({ required: true })
    devTicket!: DevTicket;

    @Output()
    onClick = new EventEmitter<number>();

    constructor() {
        this.priorityColorMap.set(DevTicketPriorities[0].id /*High*/, 'violet');
        this.priorityColorMap.set(DevTicketPriorities[1].id /*Medium*/, 'orange');
        this.priorityColorMap.set(DevTicketPriorities[2].id /*Low*/, 'default');
    }
    
    ngOnInit(): void {
        if (this.devTicket.status.name === 'New') {
            this.statusCorrespondingDate = this.devTicket.createdAt;
        }
        else if (this.devTicket.status.name === 'In Progress') {
            this.statusCorrespondingDate = this.devTicket.startedAt;
        }
        else if (this.devTicket.status.name === 'Done') {
            this.statusCorrespondingDate = this.devTicket.completedAt;
        }
    }

    doClick(): void {
        this.onClick.emit(this.devTicket.id);
    }
}
