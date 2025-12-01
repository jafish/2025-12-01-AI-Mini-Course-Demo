import { toPng } from 'html-to-image';

/**
 * Export a DOM element as PNG image
 */
export async function exportChartAsPNG(elementId, filename = 'chart.png') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      quality: 1.0,
      pixelRatio: 2
    });
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting chart:', error);
    throw error;
  }
}
