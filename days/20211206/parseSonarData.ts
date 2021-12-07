import { parseDepthLog } from './parseDepthLog';

type SonarData = {
  depthLog: string
}

type SonarSummary = {
  depth: ReturnType<typeof parseDepthLog>
}

export async function parseSonarData(data: SonarData): Promise<SonarSummary> {
  const depthSummary = parseDepthLog(data.depthLog)

  return {
    depth: depthSummary,
  };
}

