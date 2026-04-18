import { Component, OnInit } from '@angular/core';
import { Container } from "../../../components/container/container";
import { PageTitle } from "../../../components/page-title/page-title";
import { AppList } from "../../../components/app-list/app-list";
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Modal } from "../../../components/modal/modal";
import { Constants, Dummy, Empty } from '../../../../constants';

type DevTickets = {
    title: string,
    description?: string
}

@Component({
    selector: 'app-dev-tracker',
    imports: [Container, PageTitle, AppList, CommonModule, Modal],
    templateUrl: './dev-tracker.html',
    styleUrl: './dev-tracker.css',
})
export class DevTracker extends Constants implements OnInit {

    devTickets$ = new BehaviorSubject<DevTickets[]>([]);
    selectedTicketIdx: number = this.dummy.int;

    ngOnInit(): void {
        this.onAppClick(-1);
    }

    onAppClick(appId: number): void {
        let tickets: DevTickets[] = [];
        const desc = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, numquam accusamus laudantium architecto est, odit suscipit officia earum pariatur corrupti facilis. Quibusdam quod modi dolor iusto? Consectetur doloremque officia cumque?';

        for (let i = 0; i < 10; i++) {
            tickets.push({
                title: `Ticket ${i + 1}`,
                description: desc
            });
        }

        this.devTickets$.next(tickets);
    }

    onTicketClick(ticketIdx: number): void {
        this.selectedTicketIdx = ticketIdx;
    }
}
