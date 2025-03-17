import { Box, Skeleton } from "@mui/material";

const LoadingSkeleton = () => {
  return (
    <Box display="flex" flexDirection="column" gap="32px">
      <Box display="flex" flexDirection="column" gap="16px">
        <Skeleton animation="pulse" height="32px" width="30%" />
        <Box display="flex" flexDirection="column" gap="8px">
          <Box>
            <Skeleton animation="pulse" height="32px" width="90%" />
            <Skeleton animation="pulse" height="32px" width="70%" />
          </Box>
          <Box>
            <Skeleton animation="pulse" height="32px" width="90%" />
            <Skeleton animation="pulse" height="32px" width="70%" />
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap="16px">
        <Skeleton animation="pulse" height="32px" width="30%" />
        <Box display="flex" flexDirection="column" gap="8px">
          <Box>
            <Skeleton animation="pulse" height="32px" width="90%" />
            <Skeleton animation="pulse" height="32px" width="70%" />
          </Box>
          <Box>
            <Skeleton animation="pulse" height="32px" width="90%" />
            <Skeleton animation="pulse" height="32px" width="70%" />
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap="16px">
        <Skeleton animation="pulse" height="32px" width="30%" />
        <Box display="flex" flexDirection="column" gap="8px">
          <Box>
            <Skeleton animation="pulse" height="32px" width="90%" />
            <Skeleton animation="pulse" height="32px" width="70%" />
          </Box>
          <Box>
            <Skeleton animation="pulse" height="32px" width="90%" />
            <Skeleton animation="pulse" height="32px" width="70%" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingSkeleton;
