import { Box, IconButton } from "@mui/material";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";

import { SetState } from "@/lib/model";

interface Props {
  index: number;
  setIndex: SetState<number>;
  total: number;
}

const IndexSelect: React.FC<Props> = ({ index, setIndex, total }) => {
  return (
    <Box>
      {total > 1 && (
        <Box display="flex" alignItems="center" gap="4px">
          <IconButton
            onClick={() => setIndex(index - 1)}
            disabled={index === 0}
          >
            <CiCircleChevLeft fontSize="22px" />
          </IconButton>
          {index + 1} / {total}
          <IconButton
            onClick={() => setIndex(index + 1)}
            disabled={index === total - 1}
          >
            <CiCircleChevRight fontSize="22px" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default IndexSelect;
