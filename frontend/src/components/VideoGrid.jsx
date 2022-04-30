import React, { useState, useEffect } from "react";
import Header from "./Header";
import FilterPanel from "./FilterPanel";
import Container from '@mui/material/Container';
import VideoCard from "./VideoCard";
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import axios from "axios";
import { useSnackbar } from "notistack";
import { AllGenreParameter } from "../constants/constants";
import { config } from "../App";

const VideoGrid = () => {

    const{ enqueueSnackbar } = useSnackbar();
    const [videoList, setVideoList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredKeyWords, setFilteredKeywords] = useState([]);

    useEffect(() => {
        loadVideoLists();

        return (() => loadVideoLists());
    }, [])
    
    /**
     * function to call movie API (/v1/videos) to return list of movies
     */
    const loadVideoLists = async() => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.endpoint}/videos`);
            if (response.status === 200) {
                setVideoList(response.data.videos);
                setFilteredList(response.data.videos);
            }
        } catch (err) {
            if (err) {
                enqueueSnackbar(`${err.message}, Something went wrong!`, { variant: "error"});
            }
        }
        setLoading(false);
    }
    
    /** 
     *  keyword entered in search box to search movies
     * @param string
    */
    const handleSearch = (e) => {

        let value = e.target.value;

        const tempList = videoList.filter(item => item.title.toLowerCase().includes(value.toLowerCase()));
        setFilteredList(tempList);
        
        if (e.target.value === "") {
           setFilteredList(videoList);
        }
    }

    /**
     *  function to sort videos either by viewCount or releaseDate
     * @param {*} parameter to sort by "releaseDate or viewCount"
     */
    const handleSort = async (parameter) => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.endpoint}/videos?sortBy=${parameter}`);
            if (response.status === 200) {
                if (parameter === "releaseDate") {
                    setFilteredList(videoList);
                } else {
                    setFilteredList(response.data.videos);
                }
            }
        } catch (err) {
            const { response } = err;
            if (response && response.status === 400) {
                enqueueSnackbar(response.data.message, { variant: "error"});
            } else {
                enqueueSnackbar(`${err.message}, Something went wrong!`, { variant: "error"});
            }
        }
        setLoading(false);
    }

    /**
     * 
     * @param {*} item genre name by which to apply filter
     */
    const genreFilterHandler = async(item) => {
        setLoading(true);

        try {
            let searchKeyWords;
            let tempKeywords = [...filteredKeyWords];
       
            // if genre other than All 
            if (item !== AllGenreParameter) {
                // if genre already includes then remove item from array
                if (tempKeywords.includes(item)) {
                    tempKeywords.splice(tempKeywords.indexOf(item), 1);
                } 
                // if genre isn't in array, then add it to array
                else {
                    tempKeywords.push(item);
                }
                setFilteredKeywords(tempKeywords);

                 // if no item in array, i.e. All genre should be selected
                if (!tempKeywords.length) {
                    searchKeyWords = AllGenreParameter;
                } else {
                    searchKeyWords = tempKeywords.join(",");
                }
            }
            // if All genre is selected by user
            else if (item === AllGenreParameter) {
                searchKeyWords = AllGenreParameter;
                tempKeywords = [];
                setFilteredKeywords(tempKeywords);
            }

            const response = await axios.get(`${config.endpoint}/videos?genres=${searchKeyWords}`);

            if (response.status === 200) {
                setFilteredList(response.data.videos);
            }

        } catch (err) {
            const { response } = err;
            if (response && response.status === 400) {
                enqueueSnackbar(response.data.message, { variant: "error"});
            } else {
                enqueueSnackbar(`${err.message}, Something went wrong!`, { variant: "error"});
            }
        }
        setLoading(false);
    }

    return (
        <>
        <Header handleSearch={handleSearch}/>
        <FilterPanel handleSorting={handleSort} videoLists={videoList} genreFilterHandler={genreFilterHandler}/>
            <Container>
            {
                loading ?
                <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
                :
                <Grid container spacing={2} sx={{ display: 'flex',flexWrap: 'wrap' }}>
                {
                    filteredList && filteredList.length ? filteredList.map(item => {
                        return (
                            <Grid item xs={6} md={3} key={item._id}>
                                    <VideoCard videos={item} videoList={videoList} fromVideoDetails={true}/>
                            </Grid>
                        )
                    })
                    : <></>
                }
                </Grid>
            }
            </Container>
        </> 
    );
}

export default VideoGrid;