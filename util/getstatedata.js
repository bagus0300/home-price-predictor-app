export async function getStateData() {
  try {
    const response = await fetch("/api/state");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching state data:", error);
    return [];
  }
}
