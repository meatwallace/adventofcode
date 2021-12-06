import { parseSonarData } from './parseSonarData'

const MOCK_DEPTH_LOG = `
199
200
208
210
200
207
240
269
260
263
`;

it('returns the expected summary when provided with valid input', async () => {
  const summary = await parseSonarData({
    depthLog: MOCK_DEPTH_LOG,
  })

  expect(summary).toMatchInlineSnapshot(`
Object {
  "depth": Object {
    "decrements": 2,
    "increments": 7,
  },
}
`);
})
