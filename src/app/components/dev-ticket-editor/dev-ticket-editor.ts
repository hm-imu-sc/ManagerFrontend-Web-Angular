import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DevTicket, DevTicketPriorities, DevTicketStatus } from '../../pages/app-manager/dev-tracker/dev-tracker';
import { Option, OptionChooser } from "../option-chooser/option-chooser";
import { Dummy } from '../../../constants';

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
    nextStatusMap = new Map<DevTicketStatus | 'Creating', DevTicketStatus>([
        ['Creating', 'New'],
        ['New', 'In Progress'],
        ['In Progress', 'Done']
    ]);

    statusActionMap = new Map<DevTicketStatus | 'Creating', StatusUpdateActionText>([
        ['Creating', 'Create'],
        ['New', 'Start'],
        ['In Progress', 'Finish']
    ]);

    getDevTicketPriorities(): Option[] {
        return DevTicketPriorities.map((dtp, idx) => {
            if (dtp === this.devTicket.priority) {
                this.selectedPriorityId = idx;
            }
            return { id: idx, name: dtp };
        });
    }

    getTicketStatus() {
        return this.devTicket.id === Dummy.int ? 'Creating' : this.devTicket.status;
    }

    updateStatus(): void {
        this.devTicket.status = this.nextStatusMap.get(this.getTicketStatus())!;
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
        this.devTicket.description = (evt.target as HTMLTextAreaElement).value;
    }

    isCreatingNewTicket() {
        return this.devTicket.id === Dummy.int;
    }

    saveChanges() {
        
    }
}
