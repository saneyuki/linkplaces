import { BookmarkTreeNode } from '../../typings/webext/bookmarks';

export interface SidebarItemViewValue {
    bookmark: BookmarkTreeNode;
    isSelected: boolean;
    isOpening: boolean;
}

export function mapToSidebarItemEntity(bookmark: BookmarkTreeNode): SidebarItemViewValue {
    return {
        bookmark,
        isSelected: false,
        isOpening: false,
    };
}