// Carbon emission factors (kg CO2e per unit or annual baseline constants)
export interface EmissionFactors {
  transport: {
    petrolCar: number;
    dieselCar: number;
    electricCar: number;
    publicTransit: number;
    flightShort: number;
    flightLong: number;
  };
  energy: {
    electricity: number;
    naturalGas: number;
  };
  food: {
    heavyMeat: number;
    averageMeat: number;
    lowMeat: number;
    vegetarian: number;
    vegan: number;
  };
  waste: {
    averageWaste: number;
    recycledWaste: number;
  };
}

export const EMISSION_FACTORS: EmissionFactors = {
  transport: {
    petrolCar: 0.18,      // per km
    dieselCar: 0.17,      // per km
    electricCar: 0.05,    // per km (average grid intensity)
    publicTransit: 0.04,  // per km
    flightShort: 0.15,    // per km (< 1500 km total)
    flightLong: 0.11,     // per km (>= 1500 km total)
  },
  energy: {
    electricity: 0.38,    // per kWh
    naturalGas: 0.18,     // per kWh
  },
  food: {
    heavyMeat: 2.9,       // t CO2e per year
    averageMeat: 2.0,     // t CO2e per year
    lowMeat: 1.5,         // t CO2e per year
    vegetarian: 1.2,      // t CO2e per year
    vegan: 0.9,           // t CO2e per year
  },
  waste: {
    averageWaste: 450,    // kg CO2e per year
    recycledWaste: 180,   // kg CO2e per year if actively recycling
  }
};

export interface CalculatorInputs {
  carType: 'petrolCar' | 'dieselCar' | 'electricCar';
  carKmPerWeek: number;
  publicKmPerWeek: number;
  flightHoursPerYear: number;
  electricityKwhPerMonth: number;
  gasKwhPerMonth: number;
  dietType: 'heavyMeat' | 'averageMeat' | 'lowMeat' | 'vegetarian' | 'vegan';
  recycleEnabled: boolean;
}

export interface FootprintBreakdown {
  transport: number; // in metric tons t CO2e
  energy: number;    // in metric tons t CO2e
  diet: number;      // in metric tons t CO2e
  waste: number;     // in metric tons t CO2e
}

export interface FootprintResults {
  breakdown: FootprintBreakdown;
  total: number;       // in metric tons t CO2e
}

/**
 * Calculates annual carbon footprint in metric tons (t CO2e) with strong input normalization.
 */
export function calculateFootprint(inputs: Partial<CalculatorInputs>): FootprintResults {
  const carType = inputs.carType || 'petrolCar';
  const carKmPerWeek = Math.max(0, Number(inputs.carKmPerWeek) || 0);
  const publicKmPerWeek = Math.max(0, Number(inputs.publicKmPerWeek) || 0);
  const flightHoursPerYear = Math.max(0, Number(inputs.flightHoursPerYear) || 0);
  const electricityKwhPerMonth = Math.max(0, Number(inputs.electricityKwhPerMonth) || 0);
  const gasKwhPerMonth = Math.max(0, Number(inputs.gasKwhPerMonth) || 0);
  const dietType = inputs.dietType || 'averageMeat';
  const recycleEnabled = !!inputs.recycleEnabled;

  // 1. Transportation Footprint (Annualized: 52 weeks)
  const carFactor = EMISSION_FACTORS.transport[carType] ?? EMISSION_FACTORS.transport.petrolCar;
  const carAnnualKg = carKmPerWeek * 52 * carFactor;
  
  const publicAnnualKg = publicKmPerWeek * 52 * EMISSION_FACTORS.transport.publicTransit;
  
  // Standard flight speed estimate is 800 km/h for distance estimation
  const flightKm = flightHoursPerYear * 800;
  const flightFactor = flightKm < 1500 ? EMISSION_FACTORS.transport.flightShort : EMISSION_FACTORS.transport.flightLong;
  const flightAnnualKg = flightKm * flightFactor;

  const totalTransportKg = carAnnualKg + publicAnnualKg + flightAnnualKg;

  // 2. Household Energy Footprint (Annualized: 12 months)
  const electricityAnnualKg = electricityKwhPerMonth * 12 * EMISSION_FACTORS.energy.electricity;
  const gasAnnualKg = gasKwhPerMonth * 12 * EMISSION_FACTORS.energy.naturalGas;

  const totalEnergyKg = electricityAnnualKg + gasAnnualKg;

  // 3. Food Diet Footprint (Baseline is already in metric tons per year)
  const dietTons = EMISSION_FACTORS.food[dietType] ?? EMISSION_FACTORS.food.averageMeat;

  // 4. Waste Footprint (Baseline in kg per year, convert to tons)
  const wasteKg = recycleEnabled ? EMISSION_FACTORS.waste.recycledWaste : EMISSION_FACTORS.waste.averageWaste;

  // Conversions & rounding to exact standard display precision (2 decimals)
  const transportTons = parseFloat((totalTransportKg / 1000).toFixed(2));
  const energyTons = parseFloat((totalEnergyKg / 1000).toFixed(2));
  const roundedDietTons = parseFloat(dietTons.toFixed(2));
  const wasteTons = parseFloat((wasteKg / 1000).toFixed(2));

  const totalTons = parseFloat((transportTons + energyTons + roundedDietTons + wasteTons).toFixed(2));

  return {
    breakdown: {
      transport: transportTons,
      energy: energyTons,
      diet: roundedDietTons,
      waste: wasteTons
    },
    total: totalTons
  };
}
