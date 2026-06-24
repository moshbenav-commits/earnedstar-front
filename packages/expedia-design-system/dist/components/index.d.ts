import * as react from 'react';
import { ButtonHTMLAttributes, ReactNode, HTMLAttributes, InputHTMLAttributes } from 'react';
import { BrandId, BrandLogoVariant, BrandSheen } from '../brandAssets.js';

type DsButtonVariant = 'primary' | 'secondary' | 'ghost';
type DsButtonSize = 'sm' | 'md' | 'lg';
type DsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: DsButtonVariant;
    size?: DsButtonSize;
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
};
declare const DsButton: react.ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: DsButtonVariant;
    size?: DsButtonSize;
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
} & react.RefAttributes<HTMLButtonElement>>;

type DsBadgeVariant = 'flat' | 'premium';
type DsBadgeTone = 'default' | 'transmissions' | 'engines' | 'parts' | 'success' | 'muted';
type DsBadgeProps = HTMLAttributes<HTMLSpanElement> & {
    variant?: DsBadgeVariant;
    tone?: DsBadgeTone;
    selected?: boolean;
    children: ReactNode;
};
declare function DsBadge({ variant, tone, selected, className, children, ...props }: DsBadgeProps): react.JSX.Element;

type DsTabItem = {
    id: string;
    label: ReactNode;
    disabled?: boolean;
};
type DsTabsVariant = 'underline' | 'plate';
type DsTabsProps = {
    items: DsTabItem[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (id: string) => void;
    variant?: DsTabsVariant;
    className?: string;
};
declare function DsTabs({ items, value, defaultValue, onValueChange, variant, className, }: DsTabsProps): react.JSX.Element;

type DsSearchBarSize = 'hero' | 'compact';
type DsSearchBarProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    size?: DsSearchBarSize;
    label?: string;
};
declare function DsSearchBar({ size, label, className, id, ...props }: DsSearchBarProps): react.JSX.Element;

type DsPanelVariant = 'light' | 'dark' | 'glass';
type DsPanelProps = HTMLAttributes<HTMLDivElement> & {
    variant?: DsPanelVariant;
    title?: string;
    description?: string;
    children: ReactNode;
};
declare function DsPanel({ variant, title, description, className, children, ...props }: DsPanelProps): react.JSX.Element;

type BrandLogoProps = {
    brand: BrandId;
    variant?: BrandLogoVariant;
    sheen?: BrandSheen;
    tier?: 1 | 2 | 3;
    className?: string;
    width?: number;
    height?: number;
    priority?: boolean;
};
/** Flat T1 mark — production SVG from brand/logos. */
declare function BrandLogo({ brand, variant, sheen, className, width, height, priority, }: BrandLogoProps): react.JSX.Element;

type PremiumBrandLogoProps = {
    brand: Exclude<BrandId, 'parts'>;
    sheen?: BrandSheen;
    /** Chrome SVG masters include their own rim — default false avoids double .badge-metal frame */
    framed?: boolean;
    className?: string;
    width?: number;
    height?: number;
};
/** T2 chrome emblem — SVG + optional machined metal wrapper. */
declare function PremiumBrandLogo({ brand, sheen, framed, className, width, height, }: PremiumBrandLogoProps): react.JSX.Element;

type HeroBadgeProps = {
    brand: Exclude<BrandId, 'parts'>;
    sheen?: BrandSheen;
    glass?: boolean;
    /** Radial plate behind emblem — off on photo heroes */
    plate?: boolean;
    className?: string;
    width?: number;
    height?: number;
};
/** T2 hero emblem — premium chrome SVG + optional glass/plate container. */
declare function HeroBadge({ brand, sheen, glass, plate, className, width, height, }: HeroBadgeProps): react.JSX.Element;

type PhotorealHeroBadgeProps = {
    brand: Exclude<BrandId, 'parts'>;
    className?: string;
    width?: number;
    height?: number;
    /** LCP hero lockup — default true */
    priority?: boolean;
};
/**
 * T3 photoreal hero emblem — pre-rendered PNG with baked chrome lighting.
 * No CSS sheen (would fight baked speculars). Use on subsidiary homepage heroes only.
 */
declare function PhotorealHeroBadge({ brand, className, width, height, priority, }: PhotorealHeroBadgeProps): react.JSX.Element;

type StickerLogoProps = {
    brand: Exclude<BrandId, 'parts'>;
    className?: string;
    width?: number;
    height?: number;
};
/** Sticker cutline variant — navy field + white type. */
declare function StickerLogo({ brand, className, width, height, }: StickerLogoProps): react.JSX.Element;

type TrustBadgeKind = 'warranty' | 'secure-checkout' | 'verified' | 'support';
type TrustBadgeProps = HTMLAttributes<HTMLSpanElement> & {
    kind: TrustBadgeKind;
    surface?: 'light' | 'dark';
    selected?: boolean;
    compact?: boolean;
};
/** Generic trust chip for SWC adjacency, warranty rows, PDP trust strips — not SWC program state pills. */
declare function TrustBadge({ kind, surface, selected, compact, className, ...props }: TrustBadgeProps): react.JSX.Element;

export { DsBadge as Badge, type DsBadgeProps as BadgeProps, BrandLogo, type BrandLogoProps, DsButton as Button, type DsButtonProps as ButtonProps, DsBadge, type DsBadgeProps, type DsBadgeTone, type DsBadgeVariant, DsButton, type DsButtonProps, type DsButtonSize, type DsButtonVariant, DsPanel, type DsPanelProps, type DsPanelVariant, DsSearchBar, type DsSearchBarProps, type DsSearchBarSize, type DsTabItem, DsTabs, type DsTabsProps, type DsTabsVariant, HeroBadge, type HeroBadgeProps, DsPanel as Panel, type DsPanelProps as PanelProps, PhotorealHeroBadge, type PhotorealHeroBadgeProps, PremiumBrandLogo, type PremiumBrandLogoProps, DsSearchBar as SearchBar, type DsSearchBarProps as SearchBarProps, StickerLogo, type StickerLogoProps, type DsTabItem as TabItem, DsTabs as Tabs, TrustBadge, type TrustBadgeKind, type TrustBadgeProps };
