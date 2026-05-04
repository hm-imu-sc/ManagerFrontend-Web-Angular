import { DevTicketPriorityEnum } from "./DevTicketPriority"
import { DevTicketStatusEnum } from "./DevTicketStatuses"

export type DevTicketFilter = {
    status: DevTicketStatusEnum[],
    priority: DevTicketPriorityEnum[]
}