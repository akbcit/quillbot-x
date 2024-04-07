// useImageManipulation.js

import { useCallback } from 'react';

const useImageManipulation = (selectedElement: HTMLElement | null) => {
  const deleteImage = useCallback(() => {
    if (selectedElement && selectedElement.tagName === 'IMG' && selectedElement.parentNode) {
      selectedElement.parentNode.removeChild(selectedElement);
    }
  }, [selectedElement]);

  const resizeImage = useCallback((scaleFactor: number) => {
    if (selectedElement && selectedElement.tagName === 'IMG') {
      const originalWidth = selectedElement.offsetWidth;
      const originalHeight = selectedElement.offsetHeight;

      const newWidth = originalWidth * scaleFactor;
      const newHeight = originalHeight * scaleFactor;

      selectedElement.style.width = `${newWidth}px`;
      selectedElement.style.height = `${newHeight}px`;
    }
  }, [selectedElement]);

  return { deleteImage, resizeImage };
};

export default useImageManipulation;