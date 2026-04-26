export const DevTicketStatuses: { id: number, name: string }[] = [
    { id: 0, name: 'Creating' },
    { id: 1, name: 'New' },
    { id: 2, name: 'In Progress' },
    { id: 3, name: 'Done' }
] as const;
export type DevTicketStatus = typeof DevTicketStatuses[number];