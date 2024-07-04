// import React, { Suspense, lazy } from 'react';
// import { RecipeProvider } from './contexts/RecipeContext';
// import ErrorBoundary from './components/ErrorBoundary';
// import LoadingSpinner from './components/LoadingSpinner';
// import { ALLERGENS } from './config';
// import './styles/App.css';

// const RecipeList = lazy(() => import('./components/RecipeList'));
// const AddRecipeForm = lazy(() => import('./components/AddRecipeForm'));
// const AllergenFilter = lazy(() => import('./components/AllergenFilter'));
// const RecipeSearch = lazy(() => import('./components/RecipeSearch'));

// function App() {
//   return (
//     <ErrorBoundary>
//       <RecipeProvider>
//         <div className="App">
//           <h1>מתכונים ידידותיים לאלרגיות</h1>
//           <Suspense fallback={<LoadingSpinner />}>
//             <AllergenFilter allergens={ALLERGENS} />
//             <RecipeSearch />
//             <RecipeList />
//             <AddRecipeForm />
//           </Suspense>
//         </div>
//       </RecipeProvider>
//     </ErrorBoundary>
//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Recipe from './pages/Recipe';
import AddRecipe from './pages/AddRecipe';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/recipe/:id" component={Recipe} />
          <Route path="/add-recipe" component={AddRecipe} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;