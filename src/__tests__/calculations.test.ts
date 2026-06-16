// Unit Tests validating standard calculation ranges and edge cases
import { calculateFootprint, EMISSION_FACTORS } from '../utils/calculations';

// A mock runner framework signature mock to validate logic compatibility
export function runSelfTest() {
  const errors: string[] = [];

  // 1. Zero-Activity baseline test
  try {
    const zeroResults = calculateFootprint({
      carKmPerWeek: 0,
      publicKmPerWeek: 0,
      flightHoursPerYear: 0,
      electricityKwhPerMonth: 0,
      gasKwhPerMonth: 0,
      dietType: 'vegan',
      recycleEnabled: true
    });

    // Diet should equal vegan standard (0.9 t)
    if (zeroResults.breakdown.diet !== 0.9) {
      errors.push(`Expected vegan diet metric to be 0.9, got ${zeroResults.breakdown.diet}`);
    }
    // Recycle should translate 180kg => 0.18 t
    if (zeroResults.breakdown.waste !== 0.18) {
      errors.push(`Expected recycled waste metric to be 0.18, got ${zeroResults.breakdown.waste}`);
    }
    // Others should equal 0
    if (zeroResults.breakdown.transport !== 0 || zeroResults.breakdown.energy !== 0) {
      errors.push(`Expected transport & energy to be 0, got ${zeroResults.breakdown.transport} & ${zeroResults.breakdown.energy}`);
    }
    // Total should equal 1.08 t CO2e
    if (zeroResults.total !== 1.08) {
      errors.push(`Expected total zero-activity result to be 1.08, got ${zeroResults.total}`);
    }
  } catch (err: any) {
    errors.push(`Zero Activity test failed: ${err.message}`);
  }

  // 2. Safeguards test for negative numbers
  try {
    const negativeResults = calculateFootprint({
      carKmPerWeek: -500,
      publicKmPerWeek: -20,
      flightHoursPerYear: -12,
      electricityKwhPerMonth: -300,
      gasKwhPerMonth: -400,
      dietType: 'vegan',
      recycleEnabled: true
    });

    if (negativeResults.breakdown.transport !== 0 || negativeResults.breakdown.energy !== 0) {
      errors.push("Expected negative inputs to be normalized to 0");
    }
  } catch (err: any) {
    errors.push(`Negative safeguard test failed: ${err.message}`);
  }

  // 3. Standard realistic input calculations
  try {
    const standardResults = calculateFootprint({
      carType: 'petrolCar',
      carKmPerWeek: 200,
      publicKmPerWeek: 100,
      flightHoursPerYear: 5,
      electricityKwhPerMonth: 300,
      gasKwhPerMonth: 200,
      dietType: 'averageMeat',
      recycleEnabled: false
    });

    // Manual validation projections:
    // Car Travel: 200km * 52 * 0.18 = 1872 kg => 1.87t
    // Transit: 100km * 52 * 0.04 = 208 kg => 0.21t
    // Flight: 5h * 800km/h * 0.11 (Long Flight) = 440 kg => 0.44t
    // Transport Expected: 1.87 + 0.21 + 0.44 = 2.52t
    if (Math.abs(standardResults.breakdown.transport - 2.52) > 0.05) {
      errors.push(`Expected standard transportation to be ~2.52, got ${standardResults.breakdown.transport}`);
    }

    // Electricity: 300kWh * 12 * 0.38 = 1368 kg => 1.37t
    // Gas: 200kWh * 12 * 0.18 = 432 kg => 0.43t
    // Energy Expected: 1.37 + 0.43 = 1.80t
    if (Math.abs(standardResults.breakdown.energy - 1.80) > 0.05) {
      errors.push(`Expected standard energy to be ~1.80, got ${standardResults.breakdown.energy}`);
    }
  } catch (err: any) {
    errors.push(`Standard footprint calculation test failed: ${err.message}`);
  }

  return {
    success: errors.length === 0,
    errors
  };
}
