import { Nullable } from 'option-t/esm/Nullable/Nullable';

export type DomRef<T> = {
    current: Nullable<T>;
    release(): void;
};

class DomRefImpl<T> implements DomRef<T> {
    current: Nullable<T>;

    constructor() {
        this.current = null;
    }

    release(): void {
        this.current = null;
    }
}

export function createDomRef<T extends Element>(): DomRef<T> {
    const r = new DomRefImpl<T>();
    return r;
}

export function createDomElement(localname: string,
    attrs: Nullable<Iterable<[string, string]>>,
    children: Nullable<Iterable<Node>>,
    ref?: DomRef<Element>): Element {
    const subroot = window.document.createElement(localname);

    if (attrs !== null) {
        for (const [k, v] of attrs) {
            subroot.setAttribute(k, v);
        }
    }

    if (children !== null) {
        const f = createDocFragmentTree(children);
        subroot.appendChild(f);
    }

    if (ref !== undefined) {
        ref.current = subroot;
    }

    return subroot;
}

export function createDocFragmentTree(children: Iterable<Node>): DocumentFragment {
    const f = document.createDocumentFragment();

    for (const child of children) {
        f.appendChild(child);
    }

    return f;
}

export function createTextNode(text: string): Text {
    return document.createTextNode(text);
}
