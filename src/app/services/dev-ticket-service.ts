import { Injectable } from '@angular/core';
import { DevTicketStatusEnum, DevTicketStatus } from '../types/DevTicketStatuses';
import { DevTicketPriorities, DevTicketPriority, DevTicketPriorityEnum } from '../types/DevTicketPriority';
import { DevTicket } from '../types/DevTicket';
import { UtilityService } from './utility-service';
import { AlertService } from './alert-service';
import { BadgeColorProfile } from '../types/BadgeColorProfile';
import { Dummy, Empty } from '../../constants';
import { DevTicketFilter } from '../types/DevTicketFilter';

@Injectable({
    providedIn: 'root',
})
export class DevTicketService {
    public readonly devTicketStatuses: DevTicketStatus[] = [
        { 
            id: 0,
            name: 'Creating',
            icon: 'fas fa-ticket',
            color: 'text-[yellow]' 
        },
        { 
            id: 1,
            name: 'New',
            icon: 'far fa-sparkles',
            color: 'text-[dodgerblue]' 
        },
        { 
            id: 2,
            name: 'In Progress',
            icon: 'fad fa-cog animate-spin',
            color: 'text-violet-700' 
        },
        { 
            id: 3,
            name: 'Done',
            icon: 'far fa-check',
            color: 'text-green-700' 
        }
    ] as const;

    public readonly nextStatusMap = new Map<number, DevTicketStatus>([
        [DevTicketStatusEnum.Creating, this.devTicketStatuses[DevTicketStatusEnum.New]],
        [DevTicketStatusEnum.New, this.devTicketStatuses[DevTicketStatusEnum.InProgress]],
        [DevTicketStatusEnum.InProgress, this.devTicketStatuses[DevTicketStatusEnum.Done]]
    ]);

    public readonly priorityColorMap = new Map<number, BadgeColorProfile>([
        [DevTicketPriorityEnum.High, 'violet'],
        [DevTicketPriorityEnum.Medium, 'orange'],
        [DevTicketPriorityEnum.Low, 'default']
    ]);

    constructor(
        private _utilService: UtilityService,
        private _alertService: AlertService) { }

    getStatus(devTicket: DevTicket): DevTicketStatus {
        return this.devTicketStatuses[devTicket.status];
    }

    getPriority(devTicket: DevTicket): DevTicketPriority {
        return DevTicketPriorities[devTicket.priority];
    }

    getNextStatus(devTicket: DevTicket): DevTicketStatus {
        if (this._utilService.isDummyOrUndefined(devTicket.status)) {
            const error = `getNextStatus(): devTicket.status(${devTicket.status}) is undefined !`;
            this._alertService.show(`getNextStatus(): devTicket.status(${devTicket.status}) is undefined !`);
            throw error;
        }
        return this.nextStatusMap.get(devTicket.status)!;
    }
    
    getPriorityColor(devTicket: DevTicket): BadgeColorProfile {
        return this.priorityColorMap.get(this.getPriority(devTicket).id) ?? 'default';
    }
    
    isStatus(devTicket: DevTicket, statusEnum: DevTicketStatusEnum):boolean {
        return devTicket.status === statusEnum;
    }

    getStatusCorrespondingDate(devTicket: DevTicket): Date | undefined {
        if (this.isStatus(devTicket, DevTicketStatusEnum.New)) {
            return devTicket.createdAt;
        }
        else if (this.isStatus(devTicket, DevTicketStatusEnum.InProgress)) {
            return devTicket.startedAt!;
        }
        else if (this.isStatus(devTicket, DevTicketStatusEnum.Done)) {
            return devTicket.completedAt!;
        }
        return undefined;
    }

    getNewDevTicket(): DevTicket {
        return {
            id: Dummy.int,
            appId: Dummy.int,
            title: Empty.str,
            status: DevTicketStatusEnum.Creating,
            createdAt: new Date(Date.now()),
            priority: DevTicketPriorityEnum.Medium // Setting medium priotiry as default
        };
    }
 
    hasFilterSatisfied(devTicket: DevTicket, filter: DevTicketFilter | undefined | null): boolean {
        return this._utilService.isNullOrUndefined(filter)
            || ((this._utilService.isNullOrEmptyArray(filter!.status) || this._utilService.isContain(filter!.status, devTicket.status))
            && (this._utilService.isNullOrEmptyArray(filter!.priority) || this._utilService.isContain(filter!.priority, devTicket.priority)));
    }
}
