import { Component, ElementRef, OnInit } from '@angular/core';
import { PageTitle } from "../../../components/page-title/page-title";
import { AppList } from "../../../components/app-list/app-list";
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Modal } from "../../../components/modal/modal";
import { Constants, } from '../../../../constants';
import { DevTicketCard } from '../../../components/dev-ticket-card/dev-ticket-card';
import { DevTools } from '../../../../dsa/dev-tools';
import { DevTicketEditor } from "../../../components/dev-ticket-editor/dev-ticket-editor";

export type DevTicketPriority = 'High' | 'Medium' | 'Low';

export type DevTicketStatus = 'New' | 'In Progress' | 'Done';

export type DevTicket = {
    id: number,
    title: string,
    description?: string,
    status: DevTicketStatus,
    createdAt: Date,
    startedAt?: Date,
    completedAt?: Date,
    priority: DevTicketPriority
}

@Component({
    selector: 'app-dev-tracker',
    imports: [PageTitle, AppList, CommonModule, Modal, DevTicketCard, DevTicketEditor],
    templateUrl: './dev-tracker.html',
    styleUrl: './dev-tracker.css',
})
export class DevTracker extends Constants implements OnInit {

    devTickets$ = new BehaviorSubject<DevTicket[]>([]);
    selectedTicketIdx: number = this.dummy.int;

    ngOnInit(): void {
        this.onAppClick(1);
    }

    onAppClick(appId: number): void {
        let tickets: DevTicket[] = [];
        const desc = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, numquam accusamus laudantium architecto est, odit suscipit officia earum pariatur corrupti facilis. Quibusdam quod modi dolor iusto? Consectetur doloremque officia cumque?';

        for (let i = 0; i < (appId * 3) + 4; i++) {
            tickets.push({
                id: i,
                title: `The standard Lorem Ipsum passage, used since the 1500s ${i + 1}`,
                description: desc,
                status: DevTools.chooseRandom(['New', 'In Progress', 'Done']),
                createdAt: new Date('2026-01-01'),
                completedAt: new Date('2026-01-01'),
                startedAt: new Date('2026-01-01'),
                priority: DevTools.chooseRandom(['High', 'Medium', 'Low'])
            });
        }

        this.devTickets$.next(tickets);
    }

    onTicketClick(ticketIdx: number): void {
        this.selectedTicketIdx = ticketIdx;
    }
}
