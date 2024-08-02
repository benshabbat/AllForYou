import PropTypes from 'prop-types';

export const RecipePropTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
  preparationTime: PropTypes.number.isRequired,
  cookingTime: PropTypes.number.isRequired,
  difficulty: PropTypes.string.isRequired,
  servings: PropTypes.number.isRequired,
  averageRating: PropTypes.number,
  description: PropTypes.string.isRequired,
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
  createdBy: PropTypes.string.isRequired
};