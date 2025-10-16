import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, facilities, reservations, rooms, users } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    CalendarArrowDown,
    Layers,
    LayoutGrid,
    School,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Manage Users',
        href: users(),
        icon: Users,
    },
    {
        title: 'Manage Rooms',
        href: rooms(),
        icon: School,
    },
    {
        title: 'Manage Facilities',
        href: facilities(),
        icon: Layers,
    },
    {
        title: 'Manage Reservations',
        href: reservations(),
        icon: CalendarArrowDown,
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    const { props } = usePage() as {
        props: {
            auth?: {
                user?: {
                    roles?: { name: string }[];
                };
            };
        };
    };

    const user = props.auth?.user ?? {};
    const roles = user.roles?.map((r) => r.name) ?? [];
    const isSuperAdmin = roles.includes('Super_Admin');

    const filteredNavItems = mainNavItems.filter((item) => {
        if (item.title === 'Manage Users' && !isSuperAdmin) return false;
        if (item.title === 'Manage Facilities' && !isSuperAdmin) return false;
        if (item.title === 'Manage Rooms' && !isSuperAdmin) return false;
        if (item.title === 'Manage Reservations' && !isSuperAdmin) return false;
        return true;
    });
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
