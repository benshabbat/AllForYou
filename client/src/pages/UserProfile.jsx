import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from 'react-query';
import { fetchUserRecipes } from "../store/slices/recipeSlice";
import UserInfo from "../components/UserInfo";
import UserRecipes from "../components/UserRecipes";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import styles from "./UserProfile.module.css";

function UserProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data: userRecipes, isLoading, error } = useQuery(
    ['userRecipes', user?._id],
    () => dispatch(fetchUserRecipes(user?._id)).unwrap(),
    { 
      enabled: !!user?._id,
      select: (data) => Array.isArray(data) ? data : []
    }
  );

  if (isLoading) return <Loading message="טוען פרופיל..." />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!user) return <ErrorMessage message="משתמש לא מחובר" />;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>הפרופיל שלי</h1>
      <UserInfo user={user} />
      <UserRecipes recipes={userRecipes} />
    </div>
  );
}

export default React.memo(UserProfile);