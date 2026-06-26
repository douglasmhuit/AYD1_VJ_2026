require('dotenv').config({ path: '.env.test' });

jest.mock('pg', () => {
  const mockQuery = jest.fn();
  return {
    Pool: jest.fn().mockImplementation(() => ({
      query: mockQuery,
      end: jest.fn().mockResolvedValue(true)
    }))
  };
});