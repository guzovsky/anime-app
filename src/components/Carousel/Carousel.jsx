import { useContext } from "react";
import "./carousel.css";
import CarouselAnimeCard from "./CarouselAnimeCard";
import AnimeContext from "../../contexts/AnimeContext";

const Carousel = ({ header, animeList }) => {

    const {
        handleAddToFavorites,
        isFavorite,
    } = useContext(AnimeContext)

    return (
        <>
            <h2>{header}</h2>

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

        </>
    );
};

export default Carousel;
