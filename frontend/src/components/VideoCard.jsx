import React, {useState} from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import moment from "moment";
import './VideoCard.css';

const VideoCard = ({videos, videoList, fromVideoDetails }) => {
 
    const { _id, previewImage, releaseDate, title, videoLink, genre, contentRating, viewCount } = videos;
    const [isHovering, setIsHovering] = useState(false);
    const [delayHandler, setDelayHandler] = useState(null);

    const debouncedMouseHover = () => {
        setDelayHandler(setTimeout(() => setIsHovering(true) , 400));
    }

    const onMouseLeave = () => {
        setIsHovering(false);
        clearTimeout(delayHandler);
    }

    const HoverTitle = () => {
        return <Typography className="hover-title">{title}</Typography>
    }


    const CardComponent = () => {
        return (
            <Card 
                className={isHovering ? "video-tile video-tile-hover": "video-tile"} 
                onMouseOver={debouncedMouseHover} 
                onMouseOut={onMouseLeave}
                id={_id}
            >
                <CardMedia
                    component="img"
                    height="140"
                    image={previewImage}
                    alt={title}
                />
                <CardContent className="card-content"> 
                    <Typography variant="body1" className="card-title">
                    {`${title.slice(0,33)} ${title.length > 33 ? "..." : ""}`}
                    </Typography>
                    <Typography className="release-date">
                        <Box>{moment(releaseDate).fromNow()}</Box>
                        <Box className="view-count-section">
                            <Box>{viewCount}</Box>
                            <Box className="view-icon">{<VisibilityIcon/>}</Box> 
                        </Box>
                    </Typography>
                    { isHovering && <HoverTitle/> }
                </CardContent>
            </Card>
        )
    }
    
    return (
        fromVideoDetails 
        ?
        <NavLink 
            to= {{ 
                pathname: `video/${_id}`, 
                state: {videos : videos, videoList: videoList } 
            }}
            className="video-tile-link"
        > 
            {CardComponent()}
        </NavLink>
        :
       CardComponent()
    )
}

export default VideoCard;