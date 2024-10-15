export async function getLumaEvents() {
  try {
    const response = await fetch('/api/luma-events');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const events = await response.json();
    return events;
  } catch (error) {
    console.error('Error fetching Luma events:', error);
    return [];
  }
}