import { Component, Input, ElementRef, OnChanges, AfterViewInit, OnDestroy, SimpleChanges } from '@angular/core';
import { Engine, LayoutNode, installExtensions } from './core';

// Ensure extensions are installed
if (typeof window !== 'undefined') installExtensions();

@Component({
  selector: 'rc-layout',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styles: [`:host { display: grid; width: 100%; height: 100%; align-content: start; }`]
})
export class RowscolumnsComponent implements AfterViewInit, OnChanges, OnDestroy {
  // Inputs for all breakpoints
  @Input() layout: string | LayoutNode | undefined;
  @Input('layout-sm') layoutSm: string | LayoutNode | undefined;
  @Input('layout-md') layoutMd: string | LayoutNode | undefined;
  @Input('layout-lg') layoutLg: string | LayoutNode | undefined;
  @Input('layout-xl') layoutXl: string | LayoutNode | undefined;
  @Input('layout-xxl') layoutXxl: string | LayoutNode | undefined;

  // Pass styles directly to host if needed
  @Input() style: any;

  private resizeListener: (() => void) | undefined;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.render();
    
    // Bind resize listener
    this.resizeListener = () => this.render();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Re-render if inputs change
    if (changes) this.render();
  }

  ngOnDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private getActiveLayout(): LayoutNode | undefined {
    if (typeof window === 'undefined') return undefined;
    const w = window.innerWidth;
    
    // Check breakpoints (Largest to Smallest)
    if (w >= 1400 && typeof this.layoutXxl === 'object') return this.layoutXxl;
    if (w >= 1200 && typeof this.layoutXl === 'object') return this.layoutXl;
    if (w >= 992 && typeof this.layoutLg === 'object') return this.layoutLg;
    if (w >= 768 && typeof this.layoutMd === 'object') return this.layoutMd;
    if (w >= 576 && typeof this.layoutSm === 'object') return this.layoutSm;
    
    // Default
    if (typeof this.layout === 'object') return this.layout;
    
    // String fallback handled by Engine internals, but we prefer Objects in Frameworks
    return undefined;
  }

  private render() {
    const nativeEl = this.el.nativeElement;
    
    // If using string attributes, inject them for the Engine's evaluator
    if (typeof this.layout === 'string') nativeEl.setAttribute('layout', this.layout);
    if (typeof this.layoutSm === 'string') nativeEl.setAttribute('layout-sm', this.layoutSm);
    if (typeof this.layoutMd === 'string') nativeEl.setAttribute('layout-md', this.layoutMd);
    if (typeof this.layoutLg === 'string') nativeEl.setAttribute('layout-lg', this.layoutLg);
    
    // Run Engine
    Engine.render(nativeEl, this.getActiveLayout());
  }
}