import { createFileRoute } from "@tanstack/react-router";
import "../styles/home.styles.scss";
import TypeWriterTitle from "@/components/TypeWriterTitle";
import homeHeroImage from "../assets/home_hero.png";

export const Route = createFileRoute("/")({
    component: Home,
})

function Home() {

    return (
        <div id="home-page">
            <div id="home-content">
                <div id="home-banner">
                    <img id="home-hero" src={homeHeroImage} alt="home-hero-creative-person-on-laptop" />
                    <div id="home-banner-text">
                        <h1 id="home-banner-text-up">Write, create, play.</h1>
                        <div id="home-banner-text-down">
                            <span className="black-text">AI</span>
                            <span className="green-text">Blogging</span>
                            <span className="black-text">assistant</span>
                        </div>
                    </div>
                </div>
                <TypeWriterTitle />
            </div>
        </div>
    );
}