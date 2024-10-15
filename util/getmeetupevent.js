export async function getMeetupEvents() {
  try {
    const response = await fetch('/api/meetup-events');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const events = await response.json();
    return events;
  } catch (error) {
    console.error('Error fetching Meetup events:', error);
    return [];
  }
}