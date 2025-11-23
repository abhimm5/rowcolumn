import * as vue from 'vue';
import { PropType } from 'vue';
import { L as LayoutNode } from './core-CHl-GzSD.mjs';

declare const Layout: vue.DefineComponent<vue.ExtractPropTypes<{
    layout: {
        type: PropType<string | LayoutNode>;
        required: true;
    };
    'layout-sm': {
        type: PropType<string | LayoutNode>;
    };
    'layout-md': {
        type: PropType<string | LayoutNode>;
    };
    'layout-lg': {
        type: PropType<string | LayoutNode>;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    layout: {
        type: PropType<string | LayoutNode>;
        required: true;
    };
    'layout-sm': {
        type: PropType<string | LayoutNode>;
    };
    'layout-md': {
        type: PropType<string | LayoutNode>;
    };
    'layout-lg': {
        type: PropType<string | LayoutNode>;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

export { Layout };
