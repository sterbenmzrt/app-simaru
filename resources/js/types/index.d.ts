import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

// export interface User {
//     id: number;
//     name: string;
//     email: string;
//     avatar?: string;
//     email_verified_at: string | null;
//     two_factor_enabled?: boolean;
//     created_at: string;
//     updated_at: string;
//     [key: string]: unknown; // This allows for additional properties...
// }

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    email_verified_at: string | null;
    phone: string | null;
    organization: string | null;
    two_factor_confirmed_at: string | null;
    roles: Role[];
}

export interface Room {
    id: number;
    name: string;
    code: string;
    capacity: number;
    location: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
    facilities?: Facility[];
}

export interface Facility {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export enum ReservationStatus {
    Pending = 'pending',
    Approved = 'approved',
    Cancelled = 'cancelled',
    Rejected = 'rejected',
}

export interface Reservation {
    id: number;
    user_id: number;
    room_id: number;
    schedule_id: number;
    status: ReservationStatus;
    purpose: string;
    user: User;
    room: Room;
    schedule: Schedule;
}

export interface Schedule {
    id: number;
    start_time: string;
    end_time: string;
    is_blocked: boolean;
}
