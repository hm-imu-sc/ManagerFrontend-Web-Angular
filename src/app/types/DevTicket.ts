import { DevTicketPriorityEnum } from "./DevTicketPriority"
import { DevTicketStatusEnum } from "./DevTicketStatuses"

export type DevTicket = {
    id: number,
    appId: number,
    title: string,
    developmentDetails?: string,
    status: DevTicketStatusEnum,
    createdAt: Date,
    startedAt?: Date,
    completedAt?: Date,
    priority: DevTicketPriorityEnum
}