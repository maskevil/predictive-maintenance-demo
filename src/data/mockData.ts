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

export interface PredictiveDataPoint {
  time: string;
  vibration: number;
  temperature: number;
  vibrationUpper: number;
  vibrationLower: number;
  temperatureUpper: number;
  temperatureLower: number;
}

export function generatePredictiveData(): PredictiveDataPoint[] {
  const data: PredictiveDataPoint[] = [];
  const now = new Date();
  for (let i = 0; i <= 10; i++) {
    const t = new Date(now.getTime() + i * 60 * 1000);
    const h = t.getHours().toString().padStart(2, '0');
    const m = t.getMinutes().toString().padStart(2, '0');
    const timeLabel = `${h}:${m}`;

    const baseVibration = 0.6 + i * 0.08 + (Math.random() - 0.5) * 0.1;
    const baseTemperature = 65 + i * 1.5 + (Math.random() - 0.5) * 2;

    data.push({
      time: timeLabel,
      vibration: Number(baseVibration.toFixed(3)),
      temperature: Number(baseTemperature.toFixed(1)),
      vibrationUpper: Number((baseVibration + 0.15).toFixed(3)),
      vibrationLower: Number((baseVibration - 0.15).toFixed(3)),
      temperatureUpper: Number((baseTemperature + 3).toFixed(1)),
      temperatureLower: Number((baseTemperature - 3).toFixed(1)),
    });
  }
  return data;
}
