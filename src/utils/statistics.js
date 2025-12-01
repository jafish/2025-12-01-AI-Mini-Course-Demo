/**
 * Calculate statistics for numeric data
 */
export function calculateStatistics(data, column) {
  const values = data
    .map(row => parseFloat(row[column]))
    .filter(val => !isNaN(val));

  if (values.length === 0) {
    return null;
  }

  const count = values.length;
  const sum = values.reduce((acc, val) => acc + val, 0);
  const mean = sum / count;

  // Sort for median calculation
  const sorted = [...values].sort((a, b) => a - b);
  const median = count % 2 === 0
    ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
    : sorted[Math.floor(count / 2)];

  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  // Standard deviation
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / count;
  const stdDev = Math.sqrt(avgSquaredDiff);

  return {
    count,
    sum: sum.toFixed(2),
    mean: mean.toFixed(2),
    median: median.toFixed(2),
    min: min.toFixed(2),
    max: max.toFixed(2),
    stdDev: stdDev.toFixed(2)
  };
}

/**
 * Check if a column contains numeric data
 */
export function isNumericColumn(data, column) {
  if (data.length === 0) return false;
  
  const numericCount = data.filter(row => {
    const val = row[column];
    return val !== '' && val !== null && val !== undefined && !isNaN(parseFloat(val));
  }).length;

  return numericCount > data.length * 0.5; // At least 50% numeric
}

/**
 * Get all numeric columns from data
 */
export function getNumericColumns(data, columns) {
  return columns.filter(col => isNumericColumn(data, col));
}
