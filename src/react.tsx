import React, { useRef, useEffect, ReactNode, HTMLAttributes } from 'react';
import { Engine, LayoutNode } from './core';

// Define props, allowing both Strings (Vanilla style) and Objects (Native style)
interface LayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  layout: string | LayoutNode;
  'layout-sm'?: string | LayoutNode;
  'layout-md'?: string | LayoutNode;
  'layout-lg'?: string | LayoutNode;
  'layout-xl'?: string | LayoutNode;
  'layout-xxl'?: string | LayoutNode;
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  // Destructure these so they are NOT included in 'rest'
  layout, 
  'layout-sm': layoutSm,
  'layout-md': layoutMd,
  'layout-lg': layoutLg,
  'layout-xl': layoutXl,
  'layout-xxl': layoutXxl,
  ...rest 
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const getActiveDirectLayout = () => {
    if (typeof window === 'undefined') return undefined;
    const w = window.innerWidth;
    
    // Check breakpoints (Largest to Smallest)
    if (w >= 1400 && typeof layoutXxl === 'object') return layoutXxl;
    if (w >= 1200 && typeof layoutXl === 'object') return layoutXl;
    if (w >= 992 && typeof layoutLg === 'object') return layoutLg;
    if (w >= 768 && typeof layoutMd === 'object') return layoutMd;
    if (w >= 576 && typeof layoutSm === 'object') return layoutSm;
    
    // Default
    if (typeof layout === 'object') return layout;
    
    return undefined; 
  };

  const renderLayout = () => {
    if (ref.current) {
      Engine.render(ref.current, getActiveDirectLayout() as LayoutNode | undefined);
    }
  };

  useEffect(() => {
    renderLayout();
  });

  useEffect(() => {
    window.addEventListener('resize', renderLayout);
    return () => window.removeEventListener('resize', renderLayout);
  }, [layout, layoutSm, layoutMd, layoutLg, layoutXl, layoutXxl]);

  // Prepare DOM Props (Only pass strings to DOM for debugging/SSR)
  const domProps: any = { ...rest };
  
  if (typeof layout === 'string') domProps.layout = layout;
  if (typeof layoutSm === 'string') domProps['layout-sm'] = layoutSm;
  if (typeof layoutMd === 'string') domProps['layout-md'] = layoutMd;
  if (typeof layoutLg === 'string') domProps['layout-lg'] = layoutLg;
  if (typeof layoutXl === 'string') domProps['layout-xl'] = layoutXl;

  return (
    <div 
      ref={ref} 
      {...domProps} 
      style={{ display: 'grid', width: '100%', height: '100%', ...rest.style }}
    >
      {children}
    </div>
  );
};