// @ts-check

/*::
export interface IpcMsg<T> {
  id: number;
  type: string;
  value: T;
}
*/

export const MSG_TYPE_OPEN_URL = 'linkplaces-open-tab';
export const MSG_TYPE_OPEN_URL_RESULT = 'linkplaces-open-tab-result';
export const MSG_TYPE_OPEN_URL_FROM_POPUP = 'linkplaces-open-url-from-popup';
export const MSG_TYPE_OPEN_SIDEBAR_FROM_POPUP = 'linkplaces-open-classic-sidebar-from-popup';
export const MSG_TYPE_OPEN_ORGANIZE_WINDOW_FROM_POPUP = 'linkplaces-open-classic-organize-window-from-popup';

/*::
export interface OpenUrlMsg extends IpcMsg<{
  where: string;
  url: string;
}> {
  type: typeof MSG_TYPE_OPEN_URL;
};
*/
