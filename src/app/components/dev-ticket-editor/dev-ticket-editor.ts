import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Option, OptionChooser } from "../option-chooser/option-chooser";
import { Dummy } from '../../../constants';
import { UtilityService } from '../../services/utility-service';
import { DevTicket } from '../../types/DevTicket';
import { DevTicketStatus, DevTicketStatuses } from '../../types/DevTicketStatuses';
import { DevTicketPriorities } from '../../types/DevTicketPriority';

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
    nextStatusMap = new Map<number, DevTicketStatus>([
        [DevTicketStatuses[0].id /* Creating */, DevTicketStatuses[1] /* New */],
        [DevTicketStatuses[1].id /* New */, DevTicketStatuses[2]] /* In Progrss */,
        [DevTicketStatuses[2].id /* In Progrss */, DevTicketStatuses[3]] /* Done */
    ]);

    statusActionMap = new Map<number, StatusUpdateActionText>([
        [DevTicketStatuses[0].id /* Creating */, 'Create'],
        [DevTicketStatuses[1].id /* New */, 'Start'],
        [DevTicketStatuses[2].id, /* In Progrss */ 'Finish']
    ]);

    constructor(public _utilService: UtilityService) {}

    getDevTicketPriorities(): Option[] {
        return DevTicketPriorities.map((dtp, idx) => {
            if (dtp === this.devTicket.priority) {
                this.selectedPriorityId = idx;
            }
            return { id: idx, name: dtp.name };
        });
    }

    updateStatus(): void {
        this.devTicket.status = this.nextStatusMap.get(this.devTicket.status.id)!;
        if (this.isCreatingNewTicket()) {
            this.onCreateNewTicket.emit(this.devTicket);
        }
    }

    updateDevTicketPriority(priorityIdx: number) {
        this.devTicket.priority = DevTicketPriorities[priorityIdx];
    }

    updateTitle(newTitle: string) {
        this.devTicket.title = newTitle;
    }

    updateDescription(evt: KeyboardEvent) {
        this.devTicket.developmentDetails = (evt.target as HTMLTextAreaElement).value;
    }

    isCreatingNewTicket() {
        return this.devTicket.id === Dummy.int;
    }

    saveChanges() {

    }

    isDoneStatus() {
        return this.devTicket.status.id === DevTicketStatuses[3].id /* Done status */;
    }

    isEmptyTitle() {
        return this._utilService.isNullOrEmpty(this.devTicket.title);
    }
}
