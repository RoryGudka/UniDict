import { useDataContext } from "@/_contexts/DataContext";
import { useUser } from "@/_contexts/UserContext";

const useProfile = () => {
  const { user } = useUser();
  const { profile } = useDataContext();
};
