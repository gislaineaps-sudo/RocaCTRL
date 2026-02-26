import { NextResponse } from 'next/server';

/**
 * @fileOverview API para fornecimento de dados do RoçaCtrl.
 * Atende ao requisito de fornecimento de APIs para integração externa.
 */

export async function GET() {
  // Simulação de dados recuperados do banco de dados/sensores
  const stats = {
    farmName: "Sítio Primavera",
    lastUpdate: new Date().toISOString(),
    sensors: {
      soilMoisture: "42%",
      ambientTemp: "27.5°C",
      waterTank: "85%"
    },
    productionSummary: {
      totalCrops: 35,
      totalAnimals: 42,
      monthlyHarvestKg: 85
    }
  };

  return NextResponse.json(stats);
}
