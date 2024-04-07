import { pgTable, serial, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
    title: varchar('title', { length: 256 }).notNull(),
    authorEmail: varchar('author_email', { length: 256 }).notNull(),
    authorFullName: varchar('author_full_name', { length: 256 }).notNull(),
    description: text('description').notNull(),
    post: text('post'),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    authorPic: text('author_pic'),  
    postThumb: text('post_thumb'),
},
    (table) => {
        return {
            titleIdx: index("title_idx").on(table.title)
        }
    });