import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { ReleaseDate, AllGenreParameter } from "../constants/constants";
import "./FilterPanel.css";

const FilterPanel = ({ videoLists, genreFilterHandler, handleSorting }) => {

    const [sortParameter, setSortParameter] = useState(ReleaseDate);

    // extracting unique genres and content ratings
    const genreLists = [...new Set(videoLists.map(item => item.genre))]
                        .map(item => {
                            return {
                                genre: item,
                                isSelected: false
                            }
                        });
    const ratingLists = [...new Set(videoLists.map(item => item.contentRating))]
                         .map(item => {
                             return {
                                 rating: item,
                                 isSelected: false
                             }
                         });

    const [genreList, setGenreList] = useState([]);
    const [ratingList, setRatingList] = useState([]);
    const [ifAllGenreSelected, setIfAllGenreSelected] = useState(true);
    const [ifAnyAgeGroupSelected, setIfAnyAgeGroupSelected] = useState(false);

    useEffect(() => {
        setGenreList(genreLists);
        setRatingList(ratingLists);

        // this prevents the warning of memory leak
        return () => {
            setGenreList([]);
            setRatingList([]);
        }
    }, [videoLists])


    const handleAllGenreFilter = (param) => {
        genreFilterHandler(param);
        setIfAllGenreSelected(true);
        const tempList = [...genreList];
        tempList.forEach(item => item.isSelected = false)
        setGenreList(tempList);
    }

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#222222",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px"
        }}
        >
            <Box sx={{
                display: "flex",
                justifyContent: "space-around",
                width: "50%",
                marginTop: "10px"
            }}>
                <button 
                className={ifAllGenreSelected ? "genre-btn-selected" : "genre-btn"} 
                onClick={() => handleAllGenreFilter(AllGenreParameter)}
                >
                    All Genre
                </button>
                {
                    genreList && genreList.map(item => {
                        return (
                            <button 
                                className={item.isSelected ? "genre-btn-selected" : "genre-btn"}
                                id={`${item.genre}-${item.isSelected}`} 
                                key={`${item.genre}-${item.isSelected}`}
                                onClick={() => {
                                    setIfAllGenreSelected(false);
                                    genreFilterHandler(item.genre);
                                    if (item.isSelected) {
                                        item.isSelected = false;
                                    } else  {
                                        item.isSelected = true;
                                    }
                                }}
                            >
                                {item.genre} 
                            </button>
                        )
                    })
                }
                <select 
                    value={sortParameter} 
                    onChange={e => {
                        handleSorting(e.target.value); 
                        setSortParameter(e.target.value)
                    }}
                    className="sort-select"
                >
                    <option className="select-options" id="release-date-option" value="releaseDate">Release Date</option>
                    <option className="select-options" id="view-count-option" value="viewCount">View Count</option>
                </select>
            </Box>
            <Box sx={{
                display: "flex",
                justifyContent: "space-around",
                width: "50%",
                marginTop: "20px",
                marginBottom: "30px"
            }}>
                <button 
                    className={ifAnyAgeGroupSelected ? "content-rating-btn-selected" : "content-rating-btn"}
                >
                    Any age group
                </button>
                {
                    ratingList && ratingList.slice(0, ratingLists.length - 1).map(item => {
                        return (
                            <button 
                                className="content-rating-btn" 
                                id={`${item.rating}-${item.isSelected}`}
                                key={`${item.rating}-${item.isSelected}`}
                            >
                                {item.rating}
                            </button>
                        )
                    })
                }
            </Box>
        </Box>
    )
}

export default FilterPanel;