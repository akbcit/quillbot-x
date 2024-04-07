import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import "../styles/root.styles.scss";
import { NewPostProvider } from "@/context/newPostContext";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

export const Route = createRootRoute({
    component: RootLayout,
});

function RootLayout() {
    const { isAuthenticated,logout,login } = useKindeAuth();
    return (
        <>
            <div className="nav-links">
                <Link to="/">Home</Link>{' '}
                <Link to="/about">About</Link>{' '}
                {isAuthenticated && <Link to="/posts">Posts</Link>}{' '}
                {isAuthenticated && <NewPostProvider><Link to="/newPost">New Post</Link></NewPostProvider>}
                {!isAuthenticated&&<a className="nav-link"onClick={()=>login()}>Login</a>}
                {isAuthenticated&&<a className="nav-link" onClick={()=>logout()}>Logout</a>}
            </div>
            <main className="main-content">
                <NewPostProvider><Outlet /></NewPostProvider>
            </main>
        </>
    )
}


