import React, { useContext, useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Post } from "../../../../core/models/post.model";
import { useNavigate } from '@tanstack/react-router';
import "../../styles/newPost.styles.scss";
import TextEditor from '@/components/TextEditor';
import { NewPostContext } from '@/context/newPostContext';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import placeHolderPic from "../../assets/placeholder_pic.png";

export const Route = createFileRoute('/_authenticated/newPost')({
    component: AddPost,
});

function AddPost() {
    const { user, getToken  } = useKindeAuth();
    const [author, setAuthor] = useState({ fullName: "", userEmail: "", authorPic: "" });

    useEffect(() => {
        setAuthor({ fullName: `${user?.given_name}${user?.family_name ? ` ${user.family_name}` : ""}`, userEmail: user?.email ? user?.email : "", authorPic: user?.picture ? user?.picture : "" })
    }, [user])

    const { newPost, updateNewPost } = useContext(NewPostContext);

    const [newPostError, setNewPostError] = useState("");

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const postToAdd = { title: newPost.title, description: newPost.description, post: newPost.content, createdAt: new Date(), authorFullName: author.fullName, authorEmail: author.userEmail, authorPic: author.authorPic };
        await addPost(postToAdd);
    }

    const addPost = async (newPost: Post) => {
        try {
            let token = await getToken();
            if(!token){
              console.error("No token found!");
              token = "";
            }
            const res = await fetch(import.meta.env.VITE_APP_API_URL + "/posts", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost)
            });
            const resJson = await res.json();
            if (resJson.success) {
                navigate({
                    to: '/posts'
                });
            } else {
                setNewPostError("Unable to add post. Please try again later!");
            }
        } catch (error) {
            setNewPostError("An error occurred. Please try again later!");
        }
    }

    return (
        <div className="newPost-page">
            {newPostError && (
                <div>{newPostError}</div>
            )}
            <form onSubmit={handleSubmit} className="new-post-form">
                <div>
                    <textarea
                        id="title"
                        value={newPost.title}
                        onChange={(e) => updateNewPost("title", e.target.value)}
                        required
                        placeholder="Post title"
                        rows={1}
                    />
                </div>
                <div>
                    <textarea
                        id="description"
                        value={newPost.description}
                        onChange={(e) => updateNewPost("description", e.target.value)}
                        required
                        placeholder="Short description of the post"
                        rows={2}
                    />
                </div>
                <div className="author-details">
                    <div className="author-pic" style={{ backgroundImage: `url(${author.authorPic ? author.authorPic : placeHolderPic})` }}></div>                    <div className="other-details">
                        <div className="author-name">{author.fullName}</div>
                        <div className="current-date">{currentDate}</div>
                    </div>
                </div>
                <TextEditor />
                <div>
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    );
}
