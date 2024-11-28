import { z } from 'zod';

import type { Tool } from '../index'

const getWeather: Tool = {
  description: 'Get the current weather at a location',
  parameters: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  execute
}

export default getWeather;

import type { ExecutionContext } from '@/lib/ai/tools'

async function execute(parameters: Record<string, any>, options: Record<string, any>, executionContext: ExecutionContext) {
  const { latitude, longitude } = parameters
  const { streamingData, model, session, rag } = executionContext
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
  );

  const weatherData = await response.json();
  return weatherData;
}