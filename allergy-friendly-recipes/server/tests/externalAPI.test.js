import { getSubstituteOptions } from '../services/externalAPI.js';

describe('External API Integration', () => {
  it('should fetch substitute options for an ingredient', async () => {
    const options = await getSubstituteOptions('milk');
    expect(options).toBeDefined();
  });
});