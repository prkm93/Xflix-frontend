import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Container from '@mui/material/Container';
import VideoCard from "./VideoCard";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSnackbar } from "notistack";
import axios from "axios";
import moment from "moment";
import { config } from "../App";
import "./VideoDetails.css";

const VideoDetails = () => {

    const location = useLocation();
    const history = useHistory();
    const{ enqueueSnackbar } = useSnackbar();
    const { videos, videoList } = location.state;
    const slicedVideoList = videoList.slice(0,8);
    const { _id,  releaseDate, title, videoLink, genre, contentRating, viewCount, votes } = videos;

    useEffect(() => {
        updateViewHandler();
    }, [])

    /**
     * function to update view count whenever user opens the video
     */
    const updateViewHandler = async() => {
        try {
            const response = await axios.patch(`$${config.endpoint}/videos/${_id}/views`);
            if (response.status === 204) {
                console.log("view count updated");
            }
        } catch (err) {
            const {response} = err;
            if (response && response.status === 400) {
                enqueueSnackbar(response.data.message, {variant : "error"});
            } else {
                enqueueSnackbar(`${err.message}`, { variant: "error"});
            }
        }
    }

    /**
     * function to update like or dislike on video
     * @param {*} vote value either "increase" or "decrease"
     * @param {*} change whether increment or decrement the vote
     */
    const voteHandler = async (vote, change) => {
        try {
            const response = await axios.patch(`${config.endpoint}/videos/${_id}/votes`, {
                vote: vote,
                change: change
            });
        } catch (err) {
            const {response} = err;
            if (response && response.status === 400) {
                enqueueSnackbar(response.data.message, {variant : "error"});
            } else {
                enqueueSnackbar(`${err.message}, Something went wrong!`, { variant: "error"});
            }
        }
    }


    return (
        <>
        <Box sx={{
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: "10px 20px",
            backgroundColor: "#222222",
            marginBottom: "20px",
            cursor: "pointer"
        }}
        onClick={() => history.push("/")}
        >
             <Typography><span className="x-red">X</span><span className="xflix">Flix</span></Typography>
        </Box>
        <Container>
            <Card 
                className="video-tile"
                id={_id}
            >
                <iframe
                  sandbox="allow-same-origin allow-forms allow-scripts"
                  src={`https://www.${videoLink}`}
                  width="100%"
                  height="523px"
                />
                <CardContent className="video-content"> 
                    <Typography className="video-title">
                    {title}
                    </Typography>
                    <Typography className="video-votes-section">
                        <span className="video-upvote" onClick={() => voteHandler("upVote", "increase")}>{votes.upVotes}</span> 
                        <span className="video-downvote" onClick={() => voteHandler("downVote", "decrease")}>{votes.downVotes}</span>
                    </Typography>
                    <Typography className="video-release-date">
                        <Box>
                            {contentRating} <span className="video-dot"></span> {moment(releaseDate).fromNow()}
                        </Box>
                    </Typography>
                    <Typography className="video-view-section">
                            <Box className="video-genre">{genre}</Box>
                            <Box>
                                <span className="video-count">{viewCount}</span> 
                                <span className="video-view-icon">{<VisibilityIcon/>}</span>
                            </Box>
                    </Typography>
                </CardContent>
            </Card>
            <hr/>
            <Grid container spacing={2} sx={{ display: 'flex',flexWrap: 'wrap', marginTop: "30px" }}>
            {
                slicedVideoList && slicedVideoList.length ? slicedVideoList.map(item => {
                    return (
                        <Grid item xs={6} md={3} key={item._id}>
                                <VideoCard videos={item} videoList={videoList} fromVideoDetails={false}/>
                        </Grid>
                    )
                })
                : <></>
            }
            </Grid>
        </Container>
    </>
    )
}

export default VideoDetails;