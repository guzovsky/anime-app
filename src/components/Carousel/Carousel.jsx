import { useContext, useState, useRef, useEffect } from "react";
import "./carousel.css";
import CarouselAnimeCard from "./CarouselAnimeCard";
import AnimeContext from "../../contexts/AnimeContext";
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from "react-router-dom";

const Carousel = ({ header, animeList, animeListFailed, fetchFunction, animeIsLoading, statusFilter }) => {
    const {
        handleAddToFavorites,
        isFavorite,
        setGenreForSeeMorePage,
        setSideBarAnimepage,
        addAnimeToListsButtonDropDownIsOpen
    } = useContext(AnimeContext);

    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const limitedAnimeList = animeList.slice(0, 10);
    const clonedList = [...limitedAnimeList, ...limitedAnimeList];
    const autoScrollInterval = 5000;

    const isDropdownOpenInThisCarousel = clonedList.some(anime =>
        addAnimeToListsButtonDropDownIsOpen.id === anime.mal_id
    );


    const updateIsMobile = () => {
        if (window.innerWidth <= 700) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    useEffect(() => {
        updateIsMobile();
        window.addEventListener('resize', updateIsMobile);
        return () => window.removeEventListener('resize', updateIsMobile);
    }, []);

    const scrollToCard = (index) => {
        if (carouselRef.current && carouselRef.current.children.length > 0) {
            let scrollPosition = 0;
            const gapWidth = 20;

            for (let i = 0; i < index; i++) {
                scrollPosition += carouselRef.current.children[i].offsetWidth + gapWidth;
            }

            carouselRef.current.style.transform = `translateX(-${scrollPosition}px)`;
            setIsAtStart(index === 0);

            if (index >= limitedAnimeList.length) {
                setTimeout(() => {
                    carouselRef.current.style.transition = 'none';
                    setCurrentIndex(0);
                    carouselRef.current.style.transform = `translateX(0px)`;
                    carouselRef.current.offsetHeight;
                    carouselRef.current.style.transition = 'transform 0.4s ease-in-out';
                }, 400);
            } else if (index < 0) {
                setTimeout(() => {
                    carouselRef.current.style.transition = 'none';
                    setCurrentIndex(limitedAnimeList.length - 1);
                    let resetPosition = 0;
                    for (let i = 0; i < limitedAnimeList.length - 1; i++) {
                        resetPosition += carouselRef.current.children[i].offsetWidth + gapWidth;
                    }
                    carouselRef.current.style.transform = `translateX(-${resetPosition}px)`;
                    carouselRef.current.offsetHeight;
                    carouselRef.current.style.transition = 'transform 0.4s ease-in-out';
                }, 400);
            }
        }
    };

    const handleNext = () => {
        setCurrentIndex(prevIndex => prevIndex + 1);
    };

    const handlePrev = () => {
        setCurrentIndex(prevIndex => prevIndex - 1);
    };

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (touchStartX === null) return;
        const currentTouchX = e.touches[0].clientX;
        const diff = touchStartX - currentTouchX;

        const cardWidth = carouselRef.current.children[0].offsetWidth;
        const gapWidth = 20;
        const currentTransform = currentIndex * (cardWidth + gapWidth);
        const newTransform = currentTransform + diff;
        carouselRef.current.style.transform = `translateX(-${newTransform}px)`;
        carouselRef.current.style.transition = 'none';
    };

    const handleTouchEnd = (e) => {
        if (touchStartX === null) return;
        const endTouchX = e.changedTouches[0].clientX;
        const diff = touchStartX - endTouchX;

        carouselRef.current.style.transition = 'transform 0.4s ease-in-out';

        const cardWidth = carouselRef.current.children[0].offsetWidth;
        const gapWidth = 20;
        const totalCardWidth = cardWidth + gapWidth;
        const movedCards = Math.round(diff / totalCardWidth);

        setCurrentIndex(prevIndex => prevIndex + movedCards);

        setTouchStartX(null);
    };

    useEffect(() => {
        scrollToCard(currentIndex);
    }, [currentIndex]);

    useEffect(() => {
        if (isDropdownOpenInThisCarousel) return;

        const intervalId = setInterval(() => {
            handleNext();
        }, autoScrollInterval);

        return () => clearInterval(intervalId);
    }, [currentIndex, autoScrollInterval, isDropdownOpenInThisCarousel]);

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
                    <div>
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
                            <>
                                <div className="carousel-wrapper">
                                    {!isMobile && (
                                        <button className={`carousel-control prev ${isAtStart ? 'hidden' : ''}`} onClick={handlePrev}><ChevronLeft size={48} /></button>
                                    )}
                                    <div className="carousel-container">
                                        <div className={`carousel-fade-left ${isAtStart ? 'at-start' : ''}`} />
                                        <div className={`carousel-fade-right`} />

                                        <div
                                            className="carousel"
                                            ref={carouselRef}
                                            onTouchStart={handleTouchStart}
                                            onTouchMove={handleTouchMove}
                                            onTouchEnd={handleTouchEnd}
                                        >
                                            {clonedList.map((anime, index) => (
                                                <CarouselAnimeCard
                                                    key={index}
                                                    id={anime.mal_id}
                                                    anime={anime}
                                                    isFavorite={isFavorite}
                                                    onFavoriteToggle={handleAddToFavorites}
                                                    showAddButton={true}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {!isMobile && (
                                        <button className={`carousel-control next`} onClick={handleNext}><ChevronRight size={48} /></button>
                                    )}
                                </div>
                                {isMobile && (
                                    <div className="carousel-controls-bottom">
                                        <button className={`carousel-control prev ${isAtStart ? 'hidden' : ''}`} onClick={handlePrev}><ChevronLeft size={48} /></button>
                                        <button className={`carousel-control next`} onClick={handleNext}><ChevronRight size={48} /></button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p>
                                Loading...
                            </p>
                        )}

                        <div className="carousel-dots">
                            {limitedAnimeList.map((_, index) => (
                                <button
                                    key={index}
                                    className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                                    onClick={() => handleDotClick(index)}
                                />
                            ))}
                        </div>
                    </div>

                </>
            )}
        </>
    );
};

export default Carousel;