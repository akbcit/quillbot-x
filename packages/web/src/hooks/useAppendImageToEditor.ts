import { useCallback } from 'react';
import ReactQuill from 'react-quill';

// Define the type for the callback function
type AppendCallback = (updatedContent: string) => void;

export const useAppendImageToEditor = (quillRef: React.RefObject<ReactQuill>) => {
  return useCallback((imgUrl: string, callback: AppendCallback) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const length = editor.getLength(); // Get the total length of the content
      
      // Insert image at the end of the content
      editor.insertEmbed(length, 'image', imgUrl);
      
      // Move the cursor to right after the inserted image
      editor.setSelection({ index: length, length: 0 });

      // Execute callback with updated content if provided
      if (callback) {
        // Provide the updated HTML content to the callback
        callback(editor.root.innerHTML);
      }
    }
  }, [quillRef]);
};
