import * as react from 'react';
import { ReactNode } from 'react';

type DesignLabNavItem = {
    href: string;
    label: string;
};
declare const EXPEDIA_PARTS_DESIGN_LAB_NAV: readonly DesignLabNavItem[];

type DesignLabShellProps = {
    title: string;
    description: string;
    children: ReactNode;
    nav?: readonly DesignLabNavItem[];
    kicker?: string;
};
declare function DesignLabShell({ title, description, children, nav, kicker, }: DesignLabShellProps): react.JSX.Element;
declare function DesignLabSection({ title, description, children, }: {
    title: string;
    description?: string;
    children: ReactNode;
}): react.JSX.Element;
declare function DesignLabGrid({ children }: {
    children: ReactNode;
}): react.JSX.Element;
declare function DesignLabCard({ label, children, surface, }: {
    label: string;
    children: ReactNode;
    surface?: 'navy' | 'light' | 'checker' | 'hero';
}): react.JSX.Element;

export { DesignLabCard, DesignLabGrid, type DesignLabNavItem, DesignLabSection, DesignLabShell, type DesignLabShellProps, EXPEDIA_PARTS_DESIGN_LAB_NAV };
