import { defineComponent, h, ref, onMounted, onUpdated, onUnmounted, PropType } from 'vue';
import { Engine, LayoutNode } from './core';

export const Layout = defineComponent({
  name: 'Layout',
  props: {
    layout: { type: [String, Object] as PropType<string | LayoutNode>, required: true },
    'layout-sm': { type: [String, Object] as PropType<string | LayoutNode> },
    'layout-md': { type: [String, Object] as PropType<string | LayoutNode> },
    'layout-lg': { type: [String, Object] as PropType<string | LayoutNode> }
  },
  setup(props, { slots, attrs }) {
    const container = ref<HTMLElement | null>(null);

    const update = () => {
      if (container.value) {
        const w = window.innerWidth;
        let direct: LayoutNode | undefined;
        if (w >= 992 && typeof props['layout-lg'] === 'object') direct = props['layout-lg'];
        else if (w >= 768 && typeof props['layout-md'] === 'object') direct = props['layout-md'];
        else if (w >= 576 && typeof props['layout-sm'] === 'object') direct = props['layout-sm'];
        else if (typeof props.layout === 'object') direct = props.layout;
        
        Engine.render(container.value, direct);
      }
    };

    onMounted(() => {
      update();
      window.addEventListener('resize', update);
    });

    onUpdated(() => update());
    onUnmounted(() => window.removeEventListener('resize', update));

    return () => {
      const domAttrs: any = { ...attrs };
      if (typeof props.layout === 'string') domAttrs.layout = props.layout;
      if (typeof props['layout-sm'] === 'string') domAttrs['layout-sm'] = props['layout-sm'];
      
      return h('div', {
        ref: container,
        style: { display: 'grid', width: '100%', height: '100%' },
        ...domAttrs
      }, slots.default ? slots.default() : []);
    };
  }
});