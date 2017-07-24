export const MSG_TYPE_OPEN_URL = 'linkplaces-open-tab';
export const MSG_TYPE_OPEN_URL_RESULT = 'linkplaces-open-tab-result';
export const MSG_TYPE_OPEN_URL_FROM_POPUP = 'linkplaces-open-url-from-popup';
export const MSG_TYPE_OPEN_SIDEBAR_FROM_POPUP = 'linkplaces-open-classic-sidebar-from-popup';
export const MSG_TYPE_OPEN_ORGANIZE_WINDOW_FROM_POPUP = 'linkplaces-open-classic-organize-window-from-popup';

interface RemoteActionBase {
    type: string;
}

interface OpenUrlActionFromPopup extends RemoteActionBase {
    type: typeof MSG_TYPE_OPEN_URL_FROM_POPUP;
    value: {
        id: string;
        url: string;
    };
}

interface OpenSidebarActionFromPopup extends RemoteActionBase {
    type: typeof MSG_TYPE_OPEN_SIDEBAR_FROM_POPUP;
    value: null;
}

interface OpenClassicPlacesOrganizerFromPopup extends RemoteActionBase {
    type: typeof MSG_TYPE_OPEN_ORGANIZE_WINDOW_FROM_POPUP;
    value: {
        bookmarkId: string;
    };
}

export type RemoteActionMsg =
    OpenUrlActionFromPopup |
    OpenSidebarActionFromPopup |
    OpenClassicPlacesOrganizerFromPopup;