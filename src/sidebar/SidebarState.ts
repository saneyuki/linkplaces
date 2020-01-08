import { Undefinable } from 'option-t/esm/Undefinable/Undefinable';
import { combineReducers, Reducer, } from 'redux';

import { SidebarItemViewModelEntity } from './SidebarDomain';
import { Action as SidebarAction, ActionType } from './SidebarIntent';

export interface SidebarState {
    list: Iterable<SidebarItemViewModelEntity>;
}

function createInitialSidebarStore(list: Array<SidebarItemViewModelEntity> = []): SidebarState {
    return {
        list,
    };
}

function reduceSidebarState(prev: Undefinable<SidebarState>, action: SidebarAction): SidebarState {
    // redux call a reducer with `undefined` to initialize the reducer.
    // We assume this is special case.
    if (prev === undefined) {
        const init = createInitialSidebarStore();
        return init;
    }

    switch (action.type) {
        case ActionType.UpdateEntries: {
            const list = action.list;
            return {
                list,
            };
        }
        default: {
            return prev;
        }
    }
}

export type SidebarStateTree = {
    reduceSidebarState: SidebarState;
};

export function createInitialPopupMainStateTree(list: Array<SidebarItemViewModelEntity>): SidebarStateTree {
    return {
        reduceSidebarState: createInitialSidebarStore(list),
    };
}

export function createReducer(): Reducer<SidebarStateTree> {
    const reducer = combineReducers<SidebarStateTree>({
        reduceSidebarState,
    });
    return reducer;
}
