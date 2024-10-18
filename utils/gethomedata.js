export async function getHomeData() {
  try {
    const response = await fetch("/api/home");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    return [];
  }
}
