import React, { useState, useEffect } from "react";
import { Box, Chip, Skeleton, Stack } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import _ from "lodash";
import { paginate } from "../../utils/pagination"; 
import { LoadingState } from "../../services/loadingState";
import { TagsService } from "../../services/tagsService";
import Tag from "../../models/tag";

interface TagsPageProps {
  maxTagsPerPage: number;
  loadingState?: LoadingState;
}

export default function TagsList({ maxTagsPerPage, loadingState }: TagsPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [tags, setTags] = useState<Tag[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const tagService = new TagsService();
  
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await tagService.getTags().request; 
        setTags(response.data); 
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
      }
    };

    fetchTags();
  }, []); 
  const first25Chips = tags.slice(0, 25);
  const paginatedTags: Tag[][] = paginate(tags, maxTagsPerPage); 

  useEffect(() => {
    setCurrentPage(1); 
  }, [tags]);

  if (isLoading) {
    const tagSkeletons: React.JSX.Element[] = [];
    _.times(maxTagsPerPage, (i) =>
      tagSkeletons.push(
        <Skeleton key={i} variant="rectangular" height={40} sx={{ marginTop: "15px" }} />
      )
    );
    return <>{...tagSkeletons}</>;
  } else if (isError) {
    return (
      <div className="error-state">
        <SentimentDissatisfiedIcon style={{ fontSize: 60, color: "#888" }} />
        <h3>Error loading tags</h3>
      </div>
    );
  }

  return (
    <>
      <Box sx={{ width: "100%", maxWidth: 400 }}>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {first25Chips.map((tag, index) => (
          <Chip
            key={index}
            label={tag.name}
            color="primary"
            variant="outlined"
          />
        ))}
      </Stack>
    </Box>
    </>
  );
}
