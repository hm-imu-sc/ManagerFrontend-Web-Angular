export enum DevTicketStatusEnum {
    Creating,
    New,
    InProgress,
    Done
};

export type DevTicketStatus = {
    id: number,
    name: string,
    icon: string,
    color: string
}