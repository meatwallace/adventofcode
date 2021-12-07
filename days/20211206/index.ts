import fs from 'fs-extra';
import path from 'path'
import {parseSonarData} from './parseSonarData'

export async function runDayOne() {
  const depthLog = await fs.readFile(path.join(__dirname, './input'), 'utf8')

  const summary = await parseSonarData({depthLog})

  console.log(summary);
}
