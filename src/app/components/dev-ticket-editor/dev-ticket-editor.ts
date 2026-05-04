import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Option, OptionChooser } from "../generics/option-chooser/option-chooser";
import { Dummy, Empty } from '../../../constants';
import { UtilityService } from '../../services/utility-service';
import { DevTicket } from '../../types/DevTicket';
import { DevTicketStatusEnum } from '../../types/DevTicketStatuses';
import { DevTicketPriorities, DevTicketPriorityEnum } from '../../types/DevTicketPriority';
import { DevTicketService } from '../../services/dev-ticket-service';
import { marked } from 'marked';
import { ApiService } from '../../services/api-service';
import { AlertService } from '../../services/alert-service';

export const StatusUpdateActionTexts = ['Create', 'Start', 'Finish'] as const;
export type StatusUpdateActionText = typeof StatusUpdateActionTexts[number];

@Component({
    selector: 'app-dev-ticket-editor',
    imports: [OptionChooser],
    templateUrl: './dev-ticket-editor.html',
    styleUrl: './dev-ticket-editor.css',
})
export class DevTicketEditor {
    _devTicket!: DevTicket;
    _devTicketSnapShot!: DevTicket;

    get devTicket() {
        return this._devTicket;
    }

    @Input({ required: true })
    set devTicket(value: DevTicket) {
        this._devTicket = value;
        this._devTicketSnapShot = structuredClone(value);
    }

    @Output()
    onCreateNewTicket = new EventEmitter<DevTicket>();

    devTicketOldSnapshot!: DevTicket;
    selectedPriorityId: number = Dummy.int;
    updateStatusText: StatusUpdateActionText = 'Create';
    previewMarkdown = false;

    statusActionMap = new Map<number, StatusUpdateActionText>([
        [DevTicketStatusEnum.Creating, 'Create'],
        [DevTicketStatusEnum.New, 'Start'],
        [DevTicketStatusEnum.InProgress, 'Finish']
    ]);

    @HostListener('window:keydown', ['$event'])
    async handleKeyDown(event: KeyboardEvent) {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
            event.preventDefault();
            if (!this._devTicketService.isStatus(this.devTicket, DevTicketStatusEnum.Creating) && this.hasPendingChanges()) {
                await this.saveChangesAsync();
            }
        }
    }

    constructor(
        public _utilService: UtilityService,
        public _devTicketService: DevTicketService,
        public _apiService: ApiService,
        public _alertService: AlertService) { }

    getDevTicketPriorities(): Option[] {
        let priorityOptions = DevTicketPriorities.map((dtp, idx) => {
            if (dtp.id === this.devTicket.priority) {
                this.selectedPriorityId = idx;
            }
            return { id: idx, name: dtp.name };
        });
        return priorityOptions.splice(1);
    }

    async updateStatus(): Promise<void> {
        if (this.isCreatingNewTicket()) {
            this.onCreateNewTicket.emit(structuredClone(this.devTicket));
        }
        else {
            await this.saveNewStatusAsync();
        }
    }
    
    async saveNewStatusAsync(): Promise<void> {
        const api = '/api/DevTicket/updateDevTicketStatusAsync';
        const body = {
            "devTicketId": this.devTicket.id,
            "statusId": this._devTicketService.getNextStatus(this.devTicket).id
        };
        
        try {
            await this._apiService.post(api, body);
            this.devTicket.status = this._devTicketService.getNextStatus(this.devTicket).id;
            this._alertService.show('Status updated !', 'success');
        }
        catch (error) {
            console.log(`saveNewStatusAsync(): ${error}`);
            this._alertService.show(String(error), 'failed');
        }
    }

    async updatePriorityAsync(priorityEnum: DevTicketPriorityEnum) {
        if (this._devTicketService.isStatus(this._devTicket, DevTicketStatusEnum.Creating)) {
            this.devTicket.priority = priorityEnum;
        }
        else {
            await this.saveDevTicketPriorityAsync(priorityEnum);
        }
    }

    async saveDevTicketPriorityAsync(priorityEnum: DevTicketPriorityEnum) {
        const api = '/api/DevTicket/updateDevTicketPriorityAsync';
        const body = {
            "devTicketId": this.devTicket.id,
            "priorityId": priorityEnum
        };

        try {
            await this._apiService.post(api, body);
            this.devTicket.priority = priorityEnum;

            this._alertService.show('Priority updated !', 'success');
        }
        catch (error) {
            console.log(`updateDevTicketPriorityAsync(): ${error}`);
            this._alertService.show(String(error), 'failed');
        }
    }

    updateTitle(newTitle: string) {
        this.devTicket.title = newTitle;
    }

    updateDescription(evt: Event) {
        this.devTicket.developmentDetails = (evt.target as HTMLTextAreaElement).value;
    }

    isCreatingNewTicket() {
        return this._devTicketService.isStatus(this.devTicket, DevTicketStatusEnum.Creating);
    }

    async saveChangesAsync() {
        const api = '/api/DevTicket/saveTitleAndDetails';
        const body = {
            "devTicketId": this.devTicket.id,
            "title": this.devTicket.title,
            "developmentDetails": this.devTicket.developmentDetails
        };

        try {
            await this._apiService.post(api, body);
            this._devTicketSnapShot.title = this.devTicket.title;
            this._devTicketSnapShot.developmentDetails = this.devTicket.developmentDetails;
            this._alertService.show('Saved !', 'success');
        }
        catch (error) {
            this._alertService.show(String(error), 'failed');
        }
    }

    isDoneStatus() {
        return this._devTicketService.isStatus(this.devTicket, DevTicketStatusEnum.Done);
    }

    isEmptyTitle() {
        return this._utilService.isNullOrEmpty(this.devTicket.title);
    }

    toggleMarkdown(): void {
        this.previewMarkdown = !this.previewMarkdown;
    }

    renderMarkdownDevelopmentDetails() {
        return marked(this.devTicket.developmentDetails ?? Empty.str);
    }

    hasPendingChanges(): boolean {
        return (this.devTicket.title ?? Empty.str) !== (this._devTicketSnapShot.title ?? Empty.str)
            || (this.devTicket.developmentDetails ?? Empty.str) !== (this._devTicketSnapShot.developmentDetails ?? Empty.str);
    }

    onEditorClose() {
        this.devTicket.title = this._devTicketSnapShot.title;
        this.devTicket.developmentDetails = this._devTicketSnapShot.developmentDetails;
    }
}
