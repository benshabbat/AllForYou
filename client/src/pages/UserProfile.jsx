import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useQuery } from 'react-query';
import { fetchUserRecipes } from "../store/slices/recipeSlice";
import UserInfo from "../components/UserInfo";
import UserRecipes from "../components/UserRecipes";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import styles from "./UserProfile.module.css";

function UserProfile() {
  const { user } = useSelector((state) => state.auth);
  const { data: recipes, isLoading, error } = useQuery(
    ['userRecipes', user._id],
    () => fetchUserRecipes(user._id),
    { enabled: !!user._id }
  );

  useEffect(() => {
    // Fetch user recipes when component mounts and user is available
    if (user?._id) {
      dispatch(fetchUserRecipes(user._id));
    }
  }, [dispatch, user]);

  // Show loading state
  if (isLoading) return <Loading message="טוען פרופיל..." />;

  // Show error state
  if (error) return <ErrorMessage message={error} />;

  // Redirect or show message if user is not logged in
  if (!user) return <ErrorMessage message="משתמש לא מחובר" />;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>הפרופיל שלי</h1>
      <UserInfo user={user} />
      <UserRecipes recipes={userRecipes} />
    </div>
  );
}

export default UserProfile;