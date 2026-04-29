import { Injectable } from '@angular/core';
import { DevTicketStatusEnum, DevTicketStatus } from '../types/DevTicketStatuses';
import { DevTicketPriorities, DevTicketPriority, DevTicketPriorityEnum } from '../types/DevTicketPriority';
import { DevTicket } from '../types/DevTicket';
import { UtilityService } from './utility-service';
import { AlertService } from './alert-service';
import { BadgeColorProfile } from '../types/BadgeColorProfile';
import { Dummy, Empty } from '../../constants';

@Injectable({
    providedIn: 'root',
})
export class DevTicketService {
    private readonly _devTicketStatuses: DevTicketStatus[] = [
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

    private readonly _nextStatusMap = new Map<number, DevTicketStatus>([
        [DevTicketStatusEnum.Creating, this._devTicketStatuses[DevTicketStatusEnum.New]],
        [DevTicketStatusEnum.New, this._devTicketStatuses[DevTicketStatusEnum.InProgress]],
        [DevTicketStatusEnum.InProgress, this._devTicketStatuses[DevTicketStatusEnum.Done]]
    ]);

    private readonly _priorityColorMap = new Map<number, BadgeColorProfile>([
        [DevTicketPriorityEnum.High, 'violet'],
        [DevTicketPriorityEnum.Medium, 'orange'],
        [DevTicketPriorityEnum.Low, 'default']
    ]);

    constructor(
        private _utilService: UtilityService,
        private _alertService: AlertService) { }

    getStatus(devTicket: DevTicket): DevTicketStatus {
        return this._devTicketStatuses[devTicket.status];
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
        return this._nextStatusMap.get(devTicket.status)!;
    }
    
    getPriorityColor(devTicket: DevTicket): BadgeColorProfile {
        return this._priorityColorMap.get(this.getPriority(devTicket).id) ?? 'default';
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
}
    