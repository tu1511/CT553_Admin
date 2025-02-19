import { EditModeContext } from "contexts/EditModeContext";
import { useContext } from "react";

export const useEditMode = () => useContext(EditModeContext);
