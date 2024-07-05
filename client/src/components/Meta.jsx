import React from 'react';
import { Helmet } from 'react-helmet-async';

function Meta({ title, description, keywords }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
}

Meta.defaultProps = {
  title: 'מתכונים לאלרגיים - מצאו את המתכון המושלם',
  description: 'מצאו מתכונים מותאמים לאלרגיות ומגבלות תזונתיות',
  keywords: 'מתכונים, אלרגיות, תזונה, בישול'
};

export default Meta;