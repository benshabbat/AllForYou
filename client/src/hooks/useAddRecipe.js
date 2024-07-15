import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { addRecipe } from "../store/slices/recipeSlice";
import { toast } from "react-toastify";

export const useAddRecipe = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation(addRecipe, {
    onSuccess: () => {
      queryClient.invalidateQueries("recipes");
      toast.success("המתכון נוסף בהצלחה");
      navigate("/my-recipes");
    },
    onError: (error) => {
      toast.error(`שגיאה בהוספת המתכון: ${error.message}`);
    },
  });
};