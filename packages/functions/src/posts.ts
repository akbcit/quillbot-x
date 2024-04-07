import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { postsRepo } from "../../core/src/db/repos/postsRepo";
import {authMiddleware} from "../../core/src/auth";

const _postsRepo = new postsRepo();

const app = new Hono()

app.get('/posts', authMiddleware,async (c) => {
    const userId = c.var.userId;
    console.log(userId);
    const posts = await _postsRepo.getPosts();
    return c.json({ "posts": posts });
});

app.post('/posts', authMiddleware,async (c) => {
    const userId = c.var.userId;
    const newPost = await c.req.json();
    const response = await _postsRepo.addPost(newPost);
    if (response) {
        return c.json({ "success": "post added!" });
    }
    else {
        return c.json({ "error": "could not add post" });
    }
});

export const handler = handle(app)