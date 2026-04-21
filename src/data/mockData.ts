export interface DataPoint {
  time: string;
  value: number;
}

export function generateMockData(
  count: number,
  min: number,
  max: number,
  spikeAtEnd?: number,
  spikeValue?: number
): DataPoint[] {
  const data: DataPoint[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000);
    const timeLabel = `${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:00`;
    let value: number;
    if (spikeAtEnd !== undefined && spikeValue !== undefined && i === 0) {
      value = spikeValue;
    } else {
      value = Math.random() * (max - min) + min;
    }
    data.push({ time: timeLabel, value: Number(value.toFixed(2)) });
  }
  return data;
}

export function generateCurrentData(): DataPoint[] {
  return generateMockData(24, 60, 75, 0, 85.2);
}

export function generateVibrationData(): DataPoint[] {
  return generateMockData(24, 0.3, 0.8, 0, 1.2);
}

export function generateOilPressureData(): DataPoint[] {
  return generateMockData(24, 80, 100);
}

export function generateFlowData(): DataPoint[] {
  return generateMockData(24, 200, 400);
}

export function generateCurrentElectricData(): DataPoint[] {
  const data: DataPoint[] = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000);
    const timeLabel = `${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:00`;
    const value = (Math.random() - 0.5) * 10;
    data.push({ time: timeLabel, value: Number(value.toFixed(2)) });
  }
  return data;
}

export function generateRPMSData(): DataPoint[] {
  const data: DataPoint[] = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000);
    const timeLabel = `${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:00`;
    const value = 1500 + (Math.random() - 0.5) * 100;
    data.push({ time: timeLabel, value: Number(value.toFixed(2)) });
  }
  return data;
}
