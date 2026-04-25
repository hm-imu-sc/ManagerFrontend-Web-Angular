import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DevTicket, DevTicketPriority, DevTicketStatus } from '../../pages/app-manager/dev-tracker/dev-tracker';
import { DatePipe } from '@angular/common';
import { Badge, BadgeColorProfile } from "../badge/badge";

type DevTicketStatusInfo = {
    icon: string,
    color: string
}

@Component({
    selector: 'app-dev-ticket-card',
    imports: [DatePipe, Badge],
    templateUrl: './dev-ticket-card.html',
    styleUrl: './dev-ticket-card.css',
})
export class DevTicketCard implements OnInit {
    statusTextMap = new Map<DevTicketStatus, DevTicketStatusInfo>();
    priorityColorMap = new Map<DevTicketPriority, BadgeColorProfile>();
    statusCorrespondingDate?: Date;

    @Input({ required: true })
    devTicket!: DevTicket;

    @Output()
    onClick = new EventEmitter<number>();

    constructor() {
        this.statusTextMap.set('New', {
            icon: 'far fa-sparkles',
            color: 'text-[dodgerblue]'
        });
        this.statusTextMap.set('In Progress', {
            icon: 'fad fa-cog animate-spin',
            color: 'text-violet-700'
        });
        this.statusTextMap.set('Done', {
            icon: 'far fa-check',
            color: 'text-green-700'
        });

        this.priorityColorMap.set('High', 'violet');
        this.priorityColorMap.set('Medium', 'orange');
        this.priorityColorMap.set('Low', 'default');
    }
    
    ngOnInit(): void {
        if (this.devTicket.status === 'New') {
            this.statusCorrespondingDate = this.devTicket.createdAt;
        }
        else if (this.devTicket.status === 'In Progress') {
            this.statusCorrespondingDate = this.devTicket.startedAt;
        }
        else if (this.devTicket.status === 'Done') {
            this.statusCorrespondingDate = this.devTicket.completedAt;
        }
    }

    doClick(): void {
        this.onClick.emit(this.devTicket.id);
    }
}
