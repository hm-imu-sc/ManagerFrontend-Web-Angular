import { Dummy, Empty } from "../../constants";

export enum DevTicketPriorityEnum {
    High = 1,
    Medium = 2,
    Low = 3
};

export const DevTicketPriorities = [
    { id: Dummy.int, name: Empty.str },
    { id: DevTicketPriorityEnum.High, name: 'High' },
    { id: DevTicketPriorityEnum.Medium, name: 'Medium' },
    { id: DevTicketPriorityEnum.Low, name: 'Low' }
] as const;

export type DevTicketPriority = typeof DevTicketPriorities[number];