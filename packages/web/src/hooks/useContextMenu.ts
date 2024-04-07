import { useState, useCallback } from 'react';
import { MenuItem, ContextMenuState } from '../models/web.models'; // Adjust the import path as needed

// Ensure masterMenuItems is typed correctly
export const useContextMenu = (masterMenuItems: MenuItem[]) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ mouseX: null, mouseY: null, elementType: "none" });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const handleContextMenu = useCallback((event: MouseEvent, elementType: 'image' | 'text' | 'none' |`iframe`) => {
    event.preventDefault();
    // Filter menu items based on the clicked element's type
    const filteredMenuItems = masterMenuItems.filter(item =>
      item.elementType === elementType || item.elementType === 'all'
    );

    setContextMenu({
      mouseX: event.clientX + window.scrollX - 2,
      mouseY: event.clientY + window.scrollY - 2,
      elementType,
    });
    setMenuItems(filteredMenuItems);
  }, [masterMenuItems]); // Ensure masterMenuItems is included as a dependency

  const handleClose = useCallback(() => {
    setContextMenu({ mouseX: null, mouseY: null, elementType: "none" });
  }, []);

  return { contextMenu, menuItems, handleContextMenu, handleClose };
};
