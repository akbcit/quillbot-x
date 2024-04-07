import React from 'react';
import { MenuItem, ContextMenuState, SubMenuItem } from '../models/web.models';
import "../styles/contextMenu.styles.scss";

interface ContextMenuProps {
  menuItems: MenuItem[];
  contextMenu: ContextMenuState;
  handleClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ menuItems, contextMenu, handleClose }) => {
  if (!contextMenu.mouseY) return null;

  const renderSubMenuItem = (subMenuItem: SubMenuItem, key: number) => (
    <li key={key} onClick={() => { subMenuItem.onClick(); handleClose(); }}>
      {subMenuItem.label}
    </li>
  );

  return (
    <ul
      className="contextMenu"
      style={{ top: `${contextMenu.mouseY}px`, left: `${contextMenu.mouseX}px` }}
      onMouseLeave={handleClose}
    >
      {menuItems.map((item, index) => (
        <li key={index} className="menuItem" onClick={() => { item.onClick(); handleClose(); }}>
          {item.label}
          {item.submenu && (
            <>
              <span className="submenuIndicator">&gt;</span>
              <ul className="submenu">
                {item.submenu.map(renderSubMenuItem)}
              </ul>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ContextMenu;
