import tippy from 'tippy.js';
import type {Props} from 'tippy.js';
import {followCursor} from 'tippy.js';
import 'tippy.js/themes/light-border.css';
import 'tippy.js/dist/tippy.css';


export default function tooltip(elem: Element, content: string | null) {
    if (content === null) {
        return;
    }
    let props: Props = {
        ...({} as any as Props),
        content,
        allowHTML: true,
        theme: 'light-border',
        plugins: [followCursor],
        followCursor: true,
    };
    tippy(elem, props)
}