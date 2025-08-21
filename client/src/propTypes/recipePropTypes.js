import PropTypes from 'prop-types';

export const RecipePropTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
  preparationTime: PropTypes.number,
  cookingTime: PropTypes.number,
  difficulty: PropTypes.string,
  servings: PropTypes.number,
  averageRating: PropTypes.number,
  description: PropTypes.string,
  allergens: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      hebrewName: PropTypes.string,
      icon: PropTypes.string
    })
  ])),
  isFavorite: PropTypes.bool,
  createdBy: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.string,
      username: PropTypes.string
    })
  ])
};