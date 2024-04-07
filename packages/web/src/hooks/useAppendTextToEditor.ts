// useAppendContentToEditor.js
import { useCallback } from 'react';
import ReactQuill from 'react-quill';

// Define the type for the callback function
type AppendCallback = (updatedContent: string) => void;

export const useAppendTextToEditor = (quillRef:React.RefObject<ReactQuill>) => {
  return useCallback((content:string, callback:AppendCallback) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      
      // Ensure there's a newline at the end of the current content
      if (!editor.getText().endsWith('\n')) {
        editor.insertText(editor.getLength(), '\n');
      }

      // Append the new content
      editor.insertText(editor.getLength(), content);

      // Execute callback with updated content if provided
      if (callback) {
        // Provide the updated HTML content to the callback
        callback(editor.root.innerHTML);
      }
    }
  }, [quillRef]);
};
