import { Component, EventEmitter, Output, output, ViewChild } from '@angular/core';
import { PageTitle } from "../../../components/page-title/page-title";
import { AppList } from "../../../components/app-list/app-list";
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Modal } from "../../../components/modal/modal";
import { Dummy, Empty, } from '../../../../constants';
import { DevTicketCard } from '../../../components/dev-ticket-card/dev-ticket-card';
import { DevTicketEditor } from "../../../components/dev-ticket-editor/dev-ticket-editor";
import { ApiService } from '../../../services/api-service';
import { AlertService } from '../../../services/alert-service';
import { DevTicket } from '../../../types/DevTicket';
import { DevTicketStatusEnum } from '../../../types/DevTicketStatuses';
import { DevTicketPriorities, DevTicketPriorityEnum } from '../../../types/DevTicketPriority';
import { UtilityService } from '../../../services/utility-service';
import { DevTicketService } from '../../../services/dev-ticket-service';

@Component({
    selector: 'app-dev-tracker',
    imports: [PageTitle, AppList, CommonModule, Modal, DevTicketCard, DevTicketEditor],
    templateUrl: './dev-tracker.html',
    styleUrl: './dev-tracker.css',
})
export class DevTracker {

    @ViewChild(AppList)
    appList?: AppList;

    @ViewChild(DevTicketEditor)
    devTicketEditor?: DevTicketEditor;

    devTickets$ = new BehaviorSubject<DevTicket[]>([]);
    selectedTicketIdx: number = Dummy.int;
    isOpenTicketEditor: boolean = false;
    newTicket: DevTicket

    constructor(
        public _apiService: ApiService,
        public _alertService: AlertService,
        public _utilService: UtilityService,
        public _devTicketService: DevTicketService) { 
        this.newTicket = _devTicketService.getNewDevTicket();
    }

    async onAppClick(appId: number) {
        const tickets = await this.getDevTicketsAsync(appId);
        this.devTickets$.next(tickets);
    }

    onTicketClick(ticketIdx: number): void {
        this.isOpenTicketEditor = true;
        this.selectedTicketIdx = ticketIdx;
    }

    getDevTicketEditorTitle() {
        const ticket = this.selectedTicketIdx === Dummy.int ? this.newTicket : this.devTickets$.value[this.selectedTicketIdx];
        return `${this.selectedTicketIdx === Dummy.int ? 'Creating' : this._devTicketService.getStatus(ticket).name} - ${ticket.title}`;
    }

    getSelectedDevTicket(): DevTicket {
        if (this.selectedTicketIdx !== Dummy.int) {
            return this.devTickets$.value[this.selectedTicketIdx];
        }
        return this.newTicket;
    }

    closeDevTicketEditor() {
        this.devTicketEditor?.onEditorClose();
        this.newTicket = this._devTicketService.getNewDevTicket();
        this.selectedTicketIdx = Dummy.int;
        this.isOpenTicketEditor = false;
    }

    openNewTicket() {
        this.isOpenTicketEditor = true;
        this.selectedTicketIdx = Dummy.int;
    }

    async createNewTicketAsync(newTicket: DevTicket) {
        try {
            const api = '/api/DevTicket/createDevTicket';

            newTicket.appId = this.appList?.selectedApp?.id ?? Dummy.int;

            const body = {
                "title": newTicket.title,
                "developmentDetails": newTicket.developmentDetails,
                "appId": newTicket.appId,
                "statusId": DevTicketStatusEnum.New,
                "priorityId": DevTicketPriorities[newTicket.priority].id
              }

            const response = await this._apiService.post<{ devTicketId?: number }>(api, body);

            if (response.generalResponse.isSuccess) {
                newTicket.status = DevTicketStatusEnum.New;
                newTicket.id = response.devTicketId!;

                const allTickets = this.devTickets$.value;
                
                allTickets.push(newTicket);

                this.devTickets$.next(allTickets);

                this.selectedTicketIdx = allTickets.length - 1;
                this.isOpenTicketEditor = true;

                this._alertService.show(`Created new ticket.`, 'success');
                console.log(response);
            }
            else {
                throw new Error(response.generalResponse.message); 
            }
        }
        catch (error) {
            this._alertService.show(String(error), 'failed');
            console.log(`createNewTicket(): ${error}`);    
        }
    }

    async getDevTicketsAsync(appId: number): Promise<DevTicket[]> {
        const api = `/api/DevTicket/getDevTickets/${appId}`;
        let devTickets: DevTicket[] = [];
        try {
            const response = await this._apiService.get<{ devTickets: DevTicket[] }>(api);
            devTickets = response.devTickets;
        }
        catch (error) {
            this._alertService.show(String(error), 'failed');
            console.log(`getDevTicketsAsync(): ${error}`);
        }
        return devTickets;
    }

    isAppSelected(): boolean {
        return !this._utilService.isDummyOrUndefined(this.appList?.selectedAppIdx);
    }
}
