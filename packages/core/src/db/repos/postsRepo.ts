import { posts as postsTable } from "../../db/schema/posts";
import { db } from "../../db";
import { Post } from "../../../models/post.model";

export class postsRepo {

    async getPosts() {
        const posts = await db.select().from(postsTable);
        return posts;
    }

    async addPost(newPost: Post) {
        try {
            const response = await db.insert(postsTable).values({
                title: newPost.title,
                authorEmail: newPost.authorEmail,
                authorFullName: newPost.authorFullName,
                description: newPost.description,
                post: newPost.post,
                authorPic: newPost.authorPic?newPost.authorPic:"",
                postThumb: newPost.postThumb?newPost.postThumb:"",
                createdAt: new Date()
            }).returning();
            return response[0];
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
}