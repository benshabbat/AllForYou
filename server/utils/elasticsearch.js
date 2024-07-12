import { Client } from '@elastic/elasticsearch';

const client = new Client({ node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200' });

export const indexRecipe = async (recipe) => {
  await client.index({
    index: 'recipes',
    id: recipe._id.toString(),
    document: {
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      allergens: recipe.allergens.map(a => a.name),
      createdAt: recipe.createdAt
    }
  });
};

export const searchRecipes = async (query) => {
  const { body } = await client.search({
    index: 'recipes',
    body: {
      query: {
        multi_match: {
          query: query,
          fields: ['name', 'ingredients', 'instructions', 'allergens']
        }
      }
    }
  });

  return body.hits.hits.map(hit => hit._source);
};