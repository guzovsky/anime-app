import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import '../css/animeInformation.css';
import { AnimeInfo, InfoList, FormatDate, RelationsList, RemoveAutoPlay } from "./AnimeInfo";


function AnimeInformation() {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const res = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`);
                setAnime(res.data.data);
            } catch (error) {
                console.error("Error fetching anime info:", error);
            }
        };
        fetchAnime();
    }, [id]);

    if (!anime) return <p>Loading...</p>;

    return (

        <div className="anime-info-page">
            <div className="anime-info-header">
                <h2 className="anime-info-main-title">{anime.title}</h2>
                <p className="anime-info-title-jp">Japanese: {anime.title_japanese}</p>
                <p className="anime-info-title-en">English: {anime.title_english}</p>
            </div>

            <div className="anime-info-main">
                <div className="anime-info-image-container">
                    <img
                        src={anime.images.jpg.image_url}
                        alt={anime.title}
                        className="anime-info-image"
                    />
                </div>

                <div className="anime-info-details">
                    <div>
                        <h2>Basic Info:</h2>
                        <AnimeInfo anime={anime} title='Type' info='type' />
                        <AnimeInfo anime={anime} title='Status' info='status' />
                        <AnimeInfo anime={anime} title='Episodes' info='episodes' />
                        <AnimeInfo anime={anime} title='Duration' info='duration' />
                        <div>
                            <h3>Season & Year:</h3>
                            <p>{anime.season || "N/A"} {anime.year || "N/A"}</p>
                        </div>
                        <AnimeInfo anime={anime} title='Rating' info='rating' />
                        <AnimeInfo anime={anime} title='Synopsis' info='synopsis' />
                        <AnimeInfo anime={anime} title='Background' info='background' />
                    </div>

                    <div>
                        <h2>People:</h2>
                        <InfoList title='Studios' items={anime.studios} />
                        <InfoList title="Producers" items={anime.producers} />
                        <InfoList title="Licensors" items={anime.licensors} />
                    </div>

                    <div>
                        <h2>Popularity:</h2>
                        <AnimeInfo anime={anime} title='Score' info='score' />
                        <AnimeInfo anime={anime} title='Scored By' info='scored_by' />
                        <AnimeInfo anime={anime} title='Rank' info='rank' />
                        <AnimeInfo anime={anime} title='Popularity' info='popularity' />
                        <AnimeInfo anime={anime} title='Favorites' info='favorites' />
                    </div>

                    <div>
                        <h2>Genres and Themes:</h2>
                        <InfoList title='Genres' items={anime.genres} />
                        <InfoList title="Themes" items={anime.themes} />
                        <InfoList title="Demographics" items={anime.demographics} />
                    </div>

                    <div>
                        <h2>Dates:</h2>
                        <div>
                            <h3>Aired:</h3>
                            <p><strong>From: </strong>{FormatDate(anime.aired.from)} (JST)</p>
                            <p><strong>To: </strong>{FormatDate(anime.aired.to)}</p>
                        </div>
                        <div>
                            <h3>Broadcast:</h3>
                            <p><strong>Day: </strong>{anime.broadcast.day || "N/A"}</p>
                            <p><strong>Time: </strong>{anime.broadcast.time || "N/A"}</p>
                            <p><strong>Timezone: </strong>{anime.broadcast.timezone || "N/A"}</p>
                            <p><strong>String: </strong>{anime.broadcast.string || "N/A"}</p>
                        </div>
                    </div>

                    <RelationsList anime={anime} />

                    <div>
                        <h2>Streaming:</h2>
                        <InfoList title='Where to watch' items={anime.streaming} />
                    </div>

                    <div>
                        <h2>External Links:</h2>

                        {anime.trailer.embed_url ? (
                            <div className="video-wrapper">
                                <iframe
                                    src={RemoveAutoPlay(anime.trailer.embed_url)}
                                    title="Anime Trailer"
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (<p>N/A</p>)}
                    </div>

                </div>
            </div>
        </div>
    );

}

export default AnimeInformation