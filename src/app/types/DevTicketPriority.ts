export const DevTicketPriorities = [
    { id: 1, name: 'High' },
    { id: 2, name: 'Medium' },
    { id: 3, name: 'Low' }
] as const;
export type DevTicketPriority = typeof DevTicketPriorities[number];