import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import ReactQuill, { } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../styles/textEditor.styles.scss";
import { MenuItem, ExtendedQuill } from '../models/web.models';
import ContextMenu from './ContextMenu';
import { useContextMenu } from '../hooks/useContextMenu';
import useImageManipulation from '@/hooks/useImageManipulation';
import { useContext } from 'react';
import { NewPostContext } from '@/context/newPostContext';
import { getAIContentFromTitleDesc } from "../services/getAIContentFromTitleDesc";
import { useAppendTextToEditor } from '@/hooks/useAppendTextToEditor';
import { generateImageFromPhrase } from '@/services/generateImageFromPhrase';
import { useAppendImageToEditor } from '@/hooks/useAppendImageToEditor';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { expandIdeaService } from '@/services/expandIdeaService';

// Quill-specific elements that might contain text
const quillTextElementTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'B', 'STRONG', 'I', 'EM'];

const TextEditor: React.FC = () => {
  const { getToken } = useKindeAuth();
  // state to track and display errors
  const [error, setError] = useState("");
  // extract relevant props and methods from newPostContext
  const { newPost, updateNewPost, loadingAIContent, setLoadingAIContent } = useContext(NewPostContext);
  // Ref to access the Quill instance directly
  const quillRef = useRef<ReactQuill>(null);
  // State to track the currently selected element (for context menu actions)
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  // States for tracking requests to delete or resize an image
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [resizeRequested, setResizeRequested] = useState<number | null>(null);
  // State to manage when to fetch/create content
  const [createContentFromTitleDesc, setCreateContentFromTitleDesc] = useState(false);
  // state to manage when to expand idea
  const [expandIdea, setExpandIdea] = useState(false);
  // State to manage when to generate image
  const [generateImage, setGenerateImage] = useState(false);
  // State to manage phrase for image generation
  const [selectedText, setSelectedText] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setIsLoading] = useState(false);
  // Use the custom hook for appending text to editor
  const appendContentToEditor = useAppendTextToEditor(quillRef);
  // Use the custom hook for appending image to editor
  const appendImageToEditor = useAppendImageToEditor(quillRef);
  // Use the custom hook for image manipulation
  const { deleteImage, resizeImage } = useImageManipulation(selectedElement);
  // Placeholder text
  const placeholderText = 'Start typing here...';

  // Initialize with placeholder text if content is empty
  useEffect(() => {
    if (!newPost.content) {
      updateNewPost("content", `<p class="placeholder">${placeholderText}</p>`);
    }
  }, [newPost.content, updateNewPost]);
  // Effect to execute image deletion when requested
  useEffect(() => {
    if (deleteRequested && selectedElement && selectedElement.tagName === 'IMG') {
      deleteImage();
      setDeleteRequested(false);
    }
  }, [deleteRequested, selectedElement, deleteImage]);

  // Effect to execute image resizing when requested
  useEffect(() => {
    // Check if a resize is requested and the selected element is an image
    if (resizeRequested && selectedElement && selectedElement.tagName === 'IMG') {
      console.log(`Resizing to ${resizeRequested}...`);
      // Call the resizeImage function with the requested percentage
      resizeImage(resizeRequested); // Pass the percentage to resizeImage
      // Reset the resize request state
      setResizeRequested(null);
    }
  }, [resizeRequested, selectedElement, resizeImage]);


  // useEffect for generating content from title,desc
  useEffect(() => {
    const fetchContent = async () => {
      if (newPost.title && newPost.description) {
        setIsLoading(true);
        setLoadingAIContent(true);
        try {
          let token = await getToken();
          if (!token) {
            console.error("No token found!");
            token = "";
          }
          const response = await getAIContentFromTitleDesc(newPost.title, newPost.description, token);
          console.log(response);
          // Append content to the editor and update the state
          appendContentToEditor(response, (updatedContent) => {
            updateNewPost("content", updatedContent);
          });
        } catch (error) {
          console.error("Error fetching content:", error);
        } finally {
          setIsLoading(false);
          setLoadingAIContent(false);
          setCreateContentFromTitleDesc(false);
        }
      }
    };

    if (createContentFromTitleDesc) {
      fetchContent();
    }
  }, [createContentFromTitleDesc, newPost.title, newPost.description]);


  // useEffect for generating image
  useEffect(() => {
    const fetchImage = async () => {
      if (selectedText) {
        setIsLoading(true);
        setLoadingAIContent(true);
        let token = await getToken();
        if (!token) {
          console.error("No token found!");
          token = "";
        }
        try {
          const response = await generateImageFromPhrase(selectedText, token);
          // Append content to the editor and update the state
          appendImageToEditor(response.url, (updatedContent) => {
            updateNewPost("content", updatedContent); // Assuming this function updates your state correctly
          });
        } catch (error) {
          console.error("Error fetching content:", error);
          // Optionally handle the error by updating the state
        } finally {
          setIsLoading(false);
          setLoadingAIContent(false);
          setGenerateImage(false);
        }
      }
    };

    if (generateImage && selectedText) {
      fetchImage();
    }
  }, [generateImage, selectedText]);


  // useEffect for expanding idea
  useEffect(() => {
    const fetchExpandedIdea = async () => {
      setIsLoading(true);
      setLoadingAIContent(true);
      let token = await getToken();
      if (!token) {
        console.error("No token found!");
        token = "";
      }
      try {
        console.log("test");
        if (selectedText && newPost.title && newPost.description) {
          const response = await expandIdeaService(selectedText, newPost.title, newPost.description, token);
          console.log(response);
          // Append content to the editor and update the state
          appendContentToEditor(response, (updatedContent) => {
            updateNewPost("content", updatedContent);
          });
        }
        else {
          setError("You need to select some text and add title, description before initiating this request");
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        setError("Error fetching content, please try again later!");
      } finally {
        setIsLoading(false);
        setLoadingAIContent(false);
        setExpandIdea(false);
      }
    };

    if (expandIdea) {
      fetchExpandedIdea();
    }
  }, [expandIdea]);

  const masterMenuItems: MenuItem[] = useMemo(() => [
    {
      label: "Resize Image",
      onClick: () => console.log("Resizing Image..."),
      elementType: 'image',
      submenu: [
        { label: "25%", onClick: () => setResizeRequested(0.25) },
        { label: "50%", onClick: () => setResizeRequested(0.5) },
      ],
    },
    {
      label: "Delete Image",
      onClick: () => setDeleteRequested(true),
      elementType: 'image',
    },
    {
      label: "Delete Video",
      onClick: () => console.log("Deleting Video..."),
      elementType: 'iframe',
    },
    {
      label: "Create Content",
      onClick: () => setCreateContentFromTitleDesc(true),
      elementType: 'all',
    },
    {
      label: "Expand Ideas",
      onClick: () => setExpandIdea(true),
      elementType: 'text',
    },
    {
      label: "Verify Info",
      onClick: () => console.log("Verifying information..."),
      elementType: 'text',
    },
    {
      label: "Generate Image",
      onClick: () => setGenerateImage(true),
      elementType: 'text',
    },
  ], [deleteImage]);

  const { contextMenu, menuItems, handleContextMenu, handleClose } = useContextMenu(masterMenuItems);

  useEffect(() => {
    const handleRightClick = (event: MouseEvent) => {
      if (event.target && quillRef.current) {

        let elementType: 'image' | 'text' | 'iframe' | 'none' = 'none';
        const targetElement = event.target as HTMLElement;
        setSelectedElement(targetElement);
        if ((event.target as HTMLElement).tagName === 'IMG') {
          elementType = 'image';
        } else if (quillTextElementTags.includes((event.target as HTMLElement).tagName)) {
          elementType = 'text';
        } else if ((event.target as HTMLElement).tagName === 'IFRAME') {
          elementType = 'iframe';
        }
        handleContextMenu(event, elementType);
      }
    };

    const editor = quillRef.current?.getEditor() as unknown as ExtendedQuill;
    editor?.container.addEventListener('contextmenu', handleRightClick);
    return () => {
      editor?.container.removeEventListener('contextmenu', handleRightClick);
    };
  }, [handleContextMenu]);

  useEffect(() => {
    // Directly obtain the Quill editor instance
    const editor = quillRef.current?.getEditor();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const handleSelectionChange = (range: any, oldRange: any, source: string) => {
      if (range && editor) {
        // Assuming range always has index and length when it's not null
        const selectedText = editor.getText(range.index, range.length);
        console.log("Selected text:", selectedText);
        setSelectedText(selectedText);
      }
    };

    // Attach the event listener
    editor?.on('selection-change', handleSelectionChange);

    // Cleanup
    return () => {
      editor?.off('selection-change', handleSelectionChange);
    };
  }, []);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      // Safely access files property
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = () => {
          const range = quillRef.current?.getEditor().getSelection(true);
          if (range) {
            quillRef.current?.getEditor().insertEmbed(range.index, 'image', reader.result as string);
          }
        };

        reader.readAsDataURL(file);
      }
    };
  }, []);


  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), [imageHandler]);

  return (
    <>
      <div className="error-container">{error}</div>
      <ReactQuill
        ref={quillRef}
        value={newPost.content}
        onChange={(content, delta, source, editor) => updateNewPost("content", editor.getHTML())}
        modules={modules}
        className={`customHeightEditor ${loadingAIContent ? "loading-state" : ""}`}
        readOnly={loadingAIContent}
      />
      <ContextMenu menuItems={menuItems} contextMenu={contextMenu} handleClose={handleClose} />
    </>
  );
};

export default TextEditor;
