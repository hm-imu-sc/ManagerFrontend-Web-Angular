import { DevTicketPriority } from "./DevTicketPriority"
import { DevTicketStatus } from "./DevTicketStatuses"

export type DevTicket = {
    id: number,
    appId: number,
    title: string,
    developmentDetails?: string,
    status: DevTicketStatus,
    createdAt: Date,
    startedAt?: Date,
    completedAt?: Date,
    priority: DevTicketPriority
}