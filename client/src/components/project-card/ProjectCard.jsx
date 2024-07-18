import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Box } from "@mui/material";

const ProjectCard = ({
  img,
  title,
  description,
  endingDate,
  done,
  budget,
  onClick,
}) => {
  const imageUrl =
    img ||
    "https://www.axeofm.com/wp-content/uploads/2022/04/AxeoFM_Maquette3D_Drone-3.jpg";

  return (
    <Card sx={{ maxWidth: 500, height: 440, boxShadow: 3 }}>
      <CardActionArea onClick={onClick}>
        <CardMedia component="img" height="250" image={imageUrl} alt={title} />
        <CardContent>
          <Box display="flex" justifyContent="space-between">
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ alignSelf: "center", fontSize: "0.9rem" }}
            >
              {endingDate}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ marginTop: "0.5rem", fontSize: "1rem" }}
          >
            {description}
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ marginTop: "0.5rem" }}
          >
            <Typography
              variant="body2"
              color={done ? "text.primary" : "text.secondary"}
              sx={{ fontSize: "1rem", fontWeight: "bold" }}
            >
              {done ? "Completed" : "In Progress"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "1rem", fontWeight: "bold" }}
            >
              Budget: ${budget}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProjectCard;
