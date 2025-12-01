import { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import ChartPanel from './components/ChartPanel';
import StatisticsPanel from './components/StatisticsPanel';

const TABS = [
  { id: 'charts', label: 'Charts', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' },
  { id: 'table', label: 'Data Table', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  { id: 'stats', label: 'Statistics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
];

function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('charts');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDataLoaded = useCallback((result) => {
    setData(result.data);
    setColumns(result.columns);
    setError('');
  }, []);

  const handleError = useCallback((errorMessage) => {
    setError(errorMessage);
  }, []);

  const handleClearData = useCallback(() => {
    setData([]);
    setColumns([]);
    setError('');
  }, []);

  const hasData = data.length > 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-xl font-bold text-gray-900">CSV Dashboard</h1>
          </div>
          
          {hasData && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-2" role="navigation" aria-label="Main navigation">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
                      ${activeTab === tab.id 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={handleClearData}
                  className="ml-4 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Clear data and start over"
                >
                  Clear Data
                </button>
              </nav>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        {hasData && isMobileMenuOpen && (
          <nav className="md:hidden bg-white border-t border-gray-200 px-4 py-2" role="navigation" aria-label="Mobile navigation">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 text-left rounded-lg text-sm font-medium transition-colors flex items-center gap-2
                  ${activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => {
                handleClearData();
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear Data
            </button>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3" role="alert">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-red-700 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700"
              aria-label="Dismiss error"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {!hasData ? (
          /* Upload Section */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your CSV File</h2>
              <p className="text-gray-600">
                Upload a CSV file to visualize your data with interactive charts and statistics
              </p>
            </div>
            <FileUpload onDataLoaded={handleDataLoaded} onError={handleError} />
            
            {/* Features Overview */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Interactive Charts</h3>
                <p className="text-sm text-gray-600">Bar, Line, Pie, Scatter, and Area charts with tooltips and legends</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Statistics</h3>
                <p className="text-sm text-gray-600">Mean, median, min, max, standard deviation, and more</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Export Data</h3>
                <p className="text-sm text-gray-600">Export charts as PNG and data as CSV</p>
              </div>
            </div>
          </div>
        ) : (
          /* Dashboard Content */
          <div className="space-y-6">
            {/* Data Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Rows:</span>
                <span className="font-semibold text-gray-900">{data.length.toLocaleString()}</span>
              </div>
              <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Columns:</span>
                <span className="font-semibold text-gray-900">{columns.length}</span>
              </div>
              <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
              <div className="flex items-center gap-2 text-sm overflow-hidden">
                <span className="text-gray-500 flex-shrink-0">Fields:</span>
                <span className="text-gray-600 truncate" title={columns.join(', ')}>
                  {columns.slice(0, 5).join(', ')}{columns.length > 5 ? ` +${columns.length - 5} more` : ''}
                </span>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              {activeTab === 'charts' && (
                <ChartPanel data={data} columns={columns} />
              )}
              {activeTab === 'table' && (
                <DataTable data={data} columns={columns} />
              )}
              {activeTab === 'stats' && (
                <StatisticsPanel data={data} columns={columns} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          CSV Dashboard - Upload, visualize, and analyze your data
        </div>
      </footer>
    </div>
  );
}

export default App;
