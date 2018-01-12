const ATTR_NAME_SRC = 'data-src';

const enum IconType {
    Item = 'item',
    Folder = 'folder',
}

abstract class PopupIconElement extends HTMLElement {
    private _connectedOnce: boolean;
    private _type: IconType;

    constructor(type: IconType) {
        super();
        this._connectedOnce = false;
        this._type = type;
    }

    connectedCallback(): void {
        if (this._connectedOnce) {
            return;
        }

        this._connectedOnce = true;

        this.classList.add('icon');

        const img = document.createElement('img');
        const type: string = this._type;
        img.className = `popup__listitem_icon_${type}`;
        const src = this.getAttribute(ATTR_NAME_SRC) || '';
        img.src = src;
        img.alt = '';

        this.appendChild(img);
    }

    disconnectedCallback(): void {
        // don't support this operation.
    }

    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string, _namespace: string): void {
        // don't support this operation.
        if (attributeName !== ATTR_NAME_SRC) {
            return;
        }

        if (oldValue === newValue) {
            return;
        }
    }

    adoptedCallback(_oldDocument: Document, _newDocument: Document): void {
        // don't support this operation.
    }
}

export const LOCAL_NAME_POPUP_FOLDER_ICON = 'popup-folder-icon';
export class PopupFolderIconElement extends PopupIconElement {
    constructor() {
        super(IconType.Folder);
    }
}

export const LOCAL_NAME_POPUP_ITEM_ICON = 'popup-item-icon';
export class PopupItemIconElement extends PopupIconElement {
    constructor() {
        super(IconType.Item);
    }
}


interface PopupIconElementArgs extends React.Attributes {
    type: IconType;
    src: string;
}

function ReactPopupIconElement(props: PopupIconElementArgs): JSX.Element {
    const { type, src, } = props;

    return (
        <div className={'icon'}>
            <img className={`popup__listitem_icon_${type}`}
                 src={src}
                 alt={''}/>
        </div>
    );
}

interface PopupFolderIconElementArgs extends React.Attributes {
    [ATTR_NAME_SRC]: string;
}
export function ReactPopupFolderIconElement(props: PopupFolderIconElementArgs): JSX.Element {
    const src = props[ATTR_NAME_SRC];
    return (
        <ReactPopupIconElement type={IconType.Folder} src={src} />
    );
}

interface ReactPopupItemIconElementElementArgs extends React.Attributes {
    [ATTR_NAME_SRC]: string;
}
export function ReactPopupItemIconElement(props: ReactPopupItemIconElementElementArgs): JSX.Element {
    const src = props[ATTR_NAME_SRC];
    return (
        <ReactPopupIconElement type={IconType.Item} src={src} />
    );
}
