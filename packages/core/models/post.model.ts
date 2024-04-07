export interface Post {
    title: string;
    authorEmail: string;
    authorFullName: string;
    description: string;
    post: string;
    createdAt: Date;
    authorPic?:string,
    postThumb?:string,
}