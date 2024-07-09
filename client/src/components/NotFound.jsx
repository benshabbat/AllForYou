import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="not-found">
    <h1>404 - דף לא נמצא</h1>
    <p>מצטערים, הדף שאתה מחפש אינו קיים.</p>
    <Link to="/">חזרה לדף הבית</Link>
  </div>
);

export default NotFound;