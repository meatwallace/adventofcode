import fs from 'fs-extra';
import path from 'path'
import { parseSonarData } from './parseSonarData'

(async () => {
  const depthLog = await fs.readFile(path.join(__dirname, './input'), 'utf8')

  const summary = parseSonarData({ depthLog })

  console.log(summary);
})();
