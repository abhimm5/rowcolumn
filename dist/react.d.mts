import React, { HTMLAttributes, ReactNode } from 'react';
import { L as LayoutNode } from './core-CHl-GzSD.mjs';

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

export { Layout };
