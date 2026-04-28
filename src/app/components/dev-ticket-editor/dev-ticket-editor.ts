import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Option, OptionChooser } from "../option-chooser/option-chooser";
import { Dummy, Empty } from '../../../constants';
import { UtilityService } from '../../services/utility-service';
import { DevTicket } from '../../types/DevTicket';
import { DevTicketStatusEnum } from '../../types/DevTicketStatuses';
import { DevTicketPriorities, DevTicketPriorityEnum } from '../../types/DevTicketPriority';
import { DevTicketService } from '../../services/dev-ticket-service';
import { marked } from 'marked';

export const StatusUpdateActionTexts = ['Create', 'Start', 'Finish'] as const;
export type StatusUpdateActionText = typeof StatusUpdateActionTexts[number];

@Component({
    selector: 'app-dev-ticket-editor',
    imports: [OptionChooser],
    templateUrl: './dev-ticket-editor.html',
    styleUrl: './dev-ticket-editor.css',
})
export class DevTicketEditor {
    @Input({ required: true })
    devTicket!: DevTicket;

    @Output()
    onCreateNewTicket = new EventEmitter<DevTicket>();

    selectedPriorityId: number = Dummy.int;
    updateStatusText: StatusUpdateActionText = 'Create';

    previewMarkdown = false;

    statusActionMap = new Map<number, StatusUpdateActionText>([
        [DevTicketStatusEnum.Creating, 'Create'],
        [DevTicketStatusEnum.New, 'Start'],
        [DevTicketStatusEnum.InProgress, 'Finish']
    ]);

    constructor(
        public _utilService: UtilityService,
        public _devTicketService: DevTicketService) { }

    getDevTicketPriorities(): Option[] {
        let priorityOptions = DevTicketPriorities.map((dtp, idx) => {
            if (dtp.id === this.devTicket.priority) {
                this.selectedPriorityId = idx;
            }
            return { id: idx, name: dtp.name };
        });
        return priorityOptions.splice(1);
    }

    updateStatus(): void {
        this.devTicket.status = this._devTicketService.getNextStatus(this.devTicket).id;
        if (this.isCreatingNewTicket()) {
            this.onCreateNewTicket.emit(this.devTicket);
        }
    }

    updateDevTicketPriority(priorityEnum: DevTicketPriorityEnum) {
        this.devTicket.priority = DevTicketPriorities[priorityEnum].id;
    }

    updateTitle(newTitle: string) {
        this.devTicket.title = newTitle;
    }

    updateDescription(evt: Event) {
        this.devTicket.developmentDetails = (evt.target as HTMLTextAreaElement).value;
    }

    isCreatingNewTicket() {
        return this.devTicket.id === Dummy.int;
    }

    saveChanges() {

    }

    isDoneStatus() {
        return this.devTicket.status === DevTicketStatusEnum.Done;
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
}
