import { useMemo } from 'react';
import { calculateStatistics, getNumericColumns } from '../utils/statistics';

export default function StatisticsPanel({ data, columns }) {
  const numericColumns = useMemo(() => {
    return getNumericColumns(data, columns);
  }, [data, columns]);

  const statistics = useMemo(() => {
    const stats = {};
    numericColumns.forEach(column => {
      stats[column] = calculateStatistics(data, column);
    });
    return stats;
  }, [data, numericColumns]);

  if (numericColumns.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
        No numeric columns found in the data to calculate statistics.
      </div>
    );
  }

  const statLabels = [
    { key: 'count', label: 'Count' },
    { key: 'sum', label: 'Sum' },
    { key: 'mean', label: 'Mean' },
    { key: 'median', label: 'Median' },
    { key: 'min', label: 'Min' },
    { key: 'max', label: 'Max' },
    { key: 'stdDev', label: 'Std Dev' }
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statistic
            </th>
            {numericColumns.map(column => (
              <th key={column} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="truncate block max-w-[150px]" title={column}>{column}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {statLabels.map(({ key, label }) => (
            <tr key={key} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {label}
              </td>
              {numericColumns.map(column => (
                <td key={column} className="px-4 py-3 text-sm text-gray-600">
                  {statistics[column]?.[key] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
