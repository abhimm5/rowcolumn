import React, { HTMLAttributes, ReactNode } from 'react';
import { L as LayoutNode } from './core-XdQQ2SP1.js';

declare const Grid = 100;
declare const lg = 61.8;
declare const sm = 38.2;
declare const auto = "auto";
interface LayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
    layout: string | LayoutNode;
    'layout-sm'?: string | LayoutNode;
    'layout-md'?: string | LayoutNode;
    'layout-lg'?: string | LayoutNode;
    'layout-xl'?: string | LayoutNode;
    'layout-xxl'?: string | LayoutNode;
    children: ReactNode;
}
declare const Layout: React.FC<LayoutProps>;

export { Grid, Layout, auto, lg, sm };
