import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Post } from "../../../../core/models/post.model";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

import "../../styles/posts.styles.scss";


export const Route = createFileRoute("/_authenticated/posts")({
    component: AllPosts,
})

function AllPosts() {
    console.log(import.meta.env.VITE_APP_KINDE_AUDIENCE);
    const { getToken } = useKindeAuth();

    async function getAllPosts() {
        const token = await getToken();
    
        // Early exit if no token is available, to avoid making an unauthorized request
        if (!token) {
            throw new Error("No token found!");
        }
    
        const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/posts`, {
            headers: {
                'Authorization': `Bearer ${token}`,  
                'Content-Type': 'application/json'  
            },
        });
    
        if (!res.ok) {
             throw new Error(`Something went wrong, HTTP status ${res.status}`);
        }
    
        const data = await res.json();
        return data as { posts: Post[] };
    }

    const { isPending, error, data } = useQuery({
        queryKey: ["getAllPosts"],
        queryFn: getAllPosts,
    });

    if (isPending) {
        return (<div className="loading-msg">
            Loading...
        </div>)
    }

    if (error) {
        console.log(error);
        return <div className="loading-msg">Error loading posts:{error.message}</div>;
    }

    if (data.posts.length === 0) {
        return (
            <div>
                Not posts yet! Please add posts!
            </div>
        )
    }
    else {
        return (<div>
            {data.posts.map((post, index) => {
                return (<div key={index}>{post.title}</div>)
            })}
        </div>)
    }
}