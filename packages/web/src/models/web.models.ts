export type ContextMenuState = {
    mouseX: number | null;
    mouseY: number | null;
    elementType: 'image' | 'text' | 'iframe' | 'none';
  };

export interface ExtendedQuill {
    container: HTMLElement;
}

export type MenuItem = {
    label: string;
    onClick: () => void;
    elementType: 'image' | 'text' | 'iframe' | 'all';
    submenu?: SubMenuItem[];
};

// Add this inside your models or types file
export interface SubMenuItem {
    label: string;
    onClick: () => void;
  }
