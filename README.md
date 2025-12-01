# CSV Dashboard

A responsive web application dashboard that allows users to upload CSV files and visualize data as interactive charts with summary statistics.

## Features

### 📤 CSV File Upload
- Drag-and-drop upload area
- Traditional file picker button
- Support for various CSV formats
- Upload progress and error handling
- Preview of uploaded data

### 📊 Interactive Charts
Switch between multiple chart types:
- **Bar Chart**: For categorical comparisons
- **Line Chart**: For trends over time/sequences
- **Pie Chart**: For proportional data
- **Scatter Plot**: For correlation analysis
- **Area Chart**: For cumulative data visualization

Chart features:
- Interactive tooltips on hover
- Legend display
- Responsive sizing for mobile and desktop
- Ability to select X and Y axes

### 📈 Summary Statistics
Calculated statistics for numeric columns:
- Count
- Mean (average)
- Median
- Minimum value
- Maximum value
- Standard deviation
- Sum

### 📋 Data Table View
- Display uploaded CSV data in a table format
- Sortable columns (click to sort ascending/descending)
- Filterable data (search/filter input)
- Pagination for large datasets
- Responsive table design for mobile

### 💾 Export Functionality
- Export charts as PNG images
- Export filtered/sorted data as CSV
- Download buttons for each export type

### 📱 Responsive Design
- Mobile-first approach
- Works seamlessly on phones, tablets, and desktops
- Collapsible navigation for mobile
- Touch-friendly controls
- Readable fonts and appropriately sized tap targets

## Tech Stack

- **Frontend Framework**: React with Vite
- **Charting Library**: Recharts
- **Styling**: Tailwind CSS
- **CSV Parsing**: Papa Parse
- **Image Export**: html-to-image

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jafish/2025-12-01-AI-Mini-Course-Demo.git
cd 2025-12-01-AI-Mini-Course-Demo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Upload a CSV file**: Drag and drop a CSV file into the upload area, or click to browse files
2. **View Charts**: Select different chart types and customize X/Y axes
3. **Explore Data**: Switch to the Data Table tab to search, sort, and paginate through your data
4. **View Statistics**: Check the Statistics tab for calculated metrics on numeric columns
5. **Export**: Use export buttons to download charts as PNG or data as CSV

## Project Structure

```
src/
├── components/
│   ├── FileUpload.jsx    # CSV file upload component
│   ├── ChartPanel.jsx    # Interactive charts component
│   ├── DataTable.jsx     # Data table with sorting/filtering
│   └── StatisticsPanel.jsx # Statistics display
├── utils/
│   ├── dataProcessing.js # CSV parsing, filtering, sorting
│   ├── statistics.js     # Statistical calculations
│   └── exportImage.js    # Chart export functionality
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global styles (Tailwind)
```

## License

MIT
