import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PageTitle } from "../../../components/page-title/page-title";
import { AppList } from "../../../components/app-list/app-list";
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Modal } from "../../../components/modal/modal";
import { Constants, Dummy, } from '../../../../constants';
import { DevTicketCard } from '../../../components/dev-ticket-card/dev-ticket-card';
import { DevTools } from '../../../../dsa/dev-tools';
import { DevTicketEditor } from "../../../components/dev-ticket-editor/dev-ticket-editor";

export const DevTicketPriorities = ['High', 'Medium', 'Low'] as const;
export type DevTicketPriority = typeof DevTicketPriorities[number];

export const DevTicketStatuses = ['New', 'In Progress', 'Done'] as const;
export type DevTicketStatus = typeof DevTicketStatuses[number];

export type DevTicket = {
    id: number,
    appId: number,
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

    @ViewChild(AppList)
    appList!: AppList;

    nextTicketId: number = 100;
    devTickets$ = new BehaviorSubject<DevTicket[]>([]);
    selectedTicketIdx: number = Dummy.int;
    isOpenTicketEditor: boolean = false;
    newTicket: DevTicket = {
        id: Dummy.int,
        appId: Dummy.int,
        title: this.empty.str,
        status: 'New',
        createdAt: new Date(Date.now()),
        priority: 'Medium'
    }

    ngOnInit(): void {
        this.onAppClick(1);
    }

    onAppClick(appId: number): void {
        let tickets: DevTicket[] = [];
        const desc = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, numquam accusamus laudantium architecto est, odit suscipit officia earum pariatur corrupti facilis. Quibusdam quod modi dolor iusto? Consectetur doloremque officia cumque?';

        for (let i = 0; i < (appId * 3) + 4; i++) {
            tickets.push({
                id: i,
                appId: appId,
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
        this.isOpenTicketEditor = true;
        this.selectedTicketIdx = ticketIdx;
    }

    getDevTicketEditorTitle() {
        const ticket = this.selectedTicketIdx === Dummy.int ? this.newTicket : this.devTickets$.value[this.selectedTicketIdx];
        return `${this.selectedTicketIdx === Dummy.int ? 'Creating' : ticket.status} - ${ticket.title}`;
    }

    getSelectedDevTicket(): DevTicket {
        if (this.selectedTicketIdx !== Dummy.int) {
            return this.devTickets$.value[this.selectedTicketIdx]
        }
        return this.newTicket;
    }

    closeModal() {
        this.selectedTicketIdx = Dummy.int;
        this.isOpenTicketEditor = false;
    }

    openNewTicket() {
        this.isOpenTicketEditor = true;
        this.selectedTicketIdx = Dummy.int;
    }

    createNewTicket(newTicket: DevTicket) {
        newTicket.id = this.nextTicketId++;
        newTicket.appId = this.appList.selectedApp?.id ?? Dummy.int;
        const allTickets = this.devTickets$.value;
        allTickets.push(newTicket);
        this.devTickets$.next(allTickets);
        this.selectedTicketIdx = allTickets.length - 1;
        this.isOpenTicketEditor = true;
    }
}
