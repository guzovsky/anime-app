import { useContext } from "react";
import "./carousel.css";
import CarouselAnimeCard from "./CarouselAnimeCard";
import AnimeContext from "../../contexts/AnimeContext";
import { RotateCcw, MoveUp } from 'lucide-react';
import { Link } from "react-router-dom";

const Carousel = ({ header, animeList, animeListFailed, fetchFunction, animeIsLoading, statusFilter }) => {

    const {
        handleAddToFavorites,
        isFavorite,
        setGenreForSeeMorePage,
        setSideBarAnimepage,
    } = useContext(AnimeContext)

    return (
        <>
            {animeListFailed ? (
                <div className="carousel-error-container">
                    <h2>A carousel showing {header} was supposed to appear here, but an error occurred.</h2>
                    <p>Please try again.</p>
                    <button onClick={() => fetchFunction()} disabled={animeIsLoading}><RotateCcw /></button>
                </div>
            ) : (
                <>

                    <Link
                        className="carousel-header-container"
                        to={`/category/${statusFilter}`}
                        onClick={() => {
                            setGenreForSeeMorePage("");
                            setSideBarAnimepage(1);
                        }}
                    >
                        <h2>{header}</h2>
                    </Link>

                    {!animeIsLoading ? (
                        <div className="carousel-container">
                            <div className="carousel-fade-left" />
                            <div className="carousel-fade-right" />

                            <div className="carousel">
                                <div className="group">
                                    {animeList.slice(0, 20).map((anime) => (
                                        <CarouselAnimeCard
                                            key={anime.mal_id}
                                            anime={anime}
                                            isFavorite={isFavorite}
                                            onFavoriteToggle={handleAddToFavorites}
                                            showAddButton={true}
                                        />
                                    ))}
                                </div>

                                <div aria-hidden className="group">
                                    {animeList.slice(0, 20).map((anime) => (
                                        <CarouselAnimeCard
                                            key={anime.mal_id}
                                            anime={anime}
                                            isFavorite={isFavorite}
                                            onFavoriteToggle={handleAddToFavorites}
                                            showAddButton={true}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>
                            Loading...
                        </p>
                    )}
                </>
            )}


        </>
    );
};

export default Carousel;
