import { useState, useMemo } from 'react';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie,
  ScatterChart, Scatter,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { getNumericColumns } from '../utils/statistics';
import { exportChartAsPNG } from '../utils/exportImage';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Configuration constants for chart limits
const MAX_CHART_ROWS = 100;
const MAX_PIE_SLICES = 10;

const CHART_TYPES = [
  { id: 'bar', label: 'Bar Chart' },
  { id: 'line', label: 'Line Chart' },
  { id: 'pie', label: 'Pie Chart' },
  { id: 'scatter', label: 'Scatter Plot' },
  { id: 'area', label: 'Area Chart' }
];

export default function ChartPanel({ data, columns }) {
  const [chartType, setChartType] = useState('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const numericColumns = useMemo(() => {
    return getNumericColumns(data, columns);
  }, [data, columns]);

  // Initialize axis selection
  useMemo(() => {
    if (!xAxis && columns.length > 0) {
      setXAxis(columns[0]);
    }
    if (!yAxis && numericColumns.length > 0) {
      setYAxis(numericColumns[0]);
    }
  }, [columns, numericColumns, xAxis, yAxis]);

  // Prepare chart data (limit to prevent performance issues)
  const chartData = useMemo(() => {
    const limitedData = data.slice(0, MAX_CHART_ROWS);
    
    return limitedData.map((row, index) => ({
      ...row,
      _index: index,
      [yAxis]: parseFloat(row[yAxis]) || 0
    }));
  }, [data, yAxis]);

  // Prepare pie chart data (aggregate if needed)
  const pieData = useMemo(() => {
    if (chartType !== 'pie' || !xAxis || !yAxis) return [];
    
    const aggregated = {};
    data.forEach(row => {
      const key = String(row[xAxis] || 'Unknown');
      const value = parseFloat(row[yAxis]) || 0;
      aggregated[key] = (aggregated[key] || 0) + value;
    });
    
    return Object.entries(aggregated)
      .map(([name, value]) => ({ name, value }))
      .slice(0, MAX_PIE_SLICES);
  }, [data, xAxis, yAxis, chartType]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportChartAsPNG('chart-container', `${chartType}-chart.png`);
    } catch (error) {
      console.error('Failed to export chart:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const renderChart = () => {
    if (!xAxis || !yAxis) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Please select X and Y axis to visualize data
        </div>
      );
    }

    if (numericColumns.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No numeric columns available for visualization
        </div>
      );
    }

    const commonProps = {
      data: chartData
    };

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={xAxis} 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey={yAxis} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={xAxis} 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={yAxis} 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={xAxis} 
                type="number"
                name={xAxis} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                dataKey={yAxis} 
                type="number"
                name={yAxis} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name={`${xAxis} vs ${yAxis}`} data={chartData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={xAxis} 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey={yAxis} 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Chart Type Selection */}
        <div className="flex flex-wrap gap-2">
          {CHART_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setChartType(type.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${chartType === type.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              aria-pressed={chartType === type.id}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Axis Selection */}
        <div className="flex flex-col sm:flex-row gap-2 ml-auto">
          <div className="flex items-center gap-2">
            <label htmlFor="x-axis" className="text-sm text-gray-600 whitespace-nowrap">X Axis:</label>
            <select
              id="x-axis"
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {columns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="y-axis" className="text-sm text-gray-600 whitespace-nowrap">Y Axis:</label>
            <select
              id="y-axis"
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {numericColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            aria-label="Export chart as PNG"
          >
            {isExporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            Export PNG
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div 
        id="chart-container" 
        className="bg-white p-4 rounded-lg border border-gray-200"
      >
        {data.length > MAX_CHART_ROWS && (
          <div className="text-sm text-yellow-600 mb-2">
            Note: Showing first {MAX_CHART_ROWS} rows for performance. Export to CSV to see all data.
          </div>
        )}
        {renderChart()}
      </div>
    </div>
  );
}
