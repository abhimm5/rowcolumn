import React, { useRef, useEffect, ReactNode, HTMLAttributes } from 'react';
import { Engine, LayoutNode, installExtensions } from './core';

// AUTO-INSTALL EXTENSIONS
if (typeof window !== 'undefined') {
  installExtensions();
}

// RE-EXPORT CONSTANTS
export const Grid = 100;
export const lg = 61.8;
export const sm = 38.2;
export const auto = 'auto';

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
  children, layout, 'layout-sm': lSm, 'layout-md': lMd, 'layout-lg': lLg, 'layout-xl': lXl, 'layout-xxl': lXxl, ...rest 
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const getLayout = () => {
    if (typeof window === 'undefined') return undefined;
    const w = window.innerWidth;
    if (w >= 1400 && typeof lXxl === 'object') return lXxl as LayoutNode;
    if (w >= 1200 && typeof lXl === 'object') return lXl as LayoutNode;
    if (w >= 992 && typeof lLg === 'object') return lLg as LayoutNode;
    if (w >= 768 && typeof lMd === 'object') return lMd as LayoutNode;
    if (w >= 576 && typeof lSm === 'object') return lSm as LayoutNode;
    if (typeof layout === 'object') return layout as LayoutNode;
    return undefined; 
  };

  const render = () => { if (ref.current) Engine.render(ref.current, getLayout()); };

  useEffect(() => { render(); });
  useEffect(() => {
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, [layout, lSm, lMd, lLg, lXl, lXxl]);

  const domProps: any = { ...rest };
  if (typeof layout === 'string') domProps.layout = layout;
  if (typeof lSm === 'string') domProps['layout-sm'] = lSm;
  if (typeof lMd === 'string') domProps['layout-md'] = lMd;
  if (typeof lLg === 'string') domProps['layout-lg'] = lLg;
  if (typeof lXl === 'string') domProps['layout-xl'] = lXl;

  return (
    <div ref={ref} {...domProps} style={{ display: 'grid', width: '100%', height: '100%', ...rest.style }}>
      {children}
    </div>
  );
};