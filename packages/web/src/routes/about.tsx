import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
    component:Home,
})

function Home(){

    return <div>
        About
    </div>
}