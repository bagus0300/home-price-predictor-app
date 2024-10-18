from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, StaleElementReferenceException
import json
from urllib.parse import urlparse
import traceback
import logging
import time

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def setup_driver():
    chrome_options = Options()
    # chrome_options.add_argument("--headless")  # Uncomment to run in headless mode
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=chrome_options)
    return driver

def wait_for_table_update(driver, timeout=30):
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            table = driver.find_element(By.CSS_SELECTOR, "table.filterableTable")
            rows = table.find_elements(By.TAG_NAME, "tr")
            if len(rows) > 20:  # Assuming the expanded table has more than 20 rows
                logging.info(f"Table updated with {len(rows)} rows")
                return True
        except StaleElementReferenceException:
            logging.info("Encountered stale element, retrying...")
        time.sleep(1)
    return False

def scrape_redfin_states(state_urls):
    driver = setup_driver()
    results = {}

    try:
        for url in state_urls:
            logging.info(f"Starting to scrape {url}")
            driver.get(url)

            try:
                # Wait for the element to be present
                logging.info("Waiting for state description to load")
                element = WebDriverWait(driver, 20).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "div.statePageDescription h1"))
                )
                
                # Extract the text
                h1_text = element.text
                logging.info(f"State description: {h1_text}")
                
                # Get state name from URL
                state_name = urlparse(url).path.split('/')[-1]
                logging.info(f"State name: {state_name}")
                
                # Click "Show full list" button
                logging.info("Attempting to click 'Show full list' button")
                show_full_list_button = WebDriverWait(driver, 20).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, "div.link-text.clickable.expand-link"))
                )
                driver.execute_script("arguments[0].click();", show_full_list_button)
                logging.info("'Show full list' button clicked successfully")
                
                # Wait for the table to update
                logging.info("Waiting for table to update")
                if wait_for_table_update(driver):
                    logging.info("Table updated successfully")
                else:
                    logging.warning("Table update timeout, proceeding with available data")
                
                # Extract city data
                logging.info("Extracting city data")
                city_data = extract_city_data(driver)
                logging.info(f"Extracted data for {len(city_data)} cities")
                
                # Store the results
                results[state_name] = {
                    "description": h1_text,
                    "cities": city_data
                }
                
                logging.info(f"Successfully scraped data for {state_name}")
                
            except Exception as e:
                logging.error(f"An error occurred while scraping {url}: {str(e)}")
                logging.error(traceback.format_exc())
        
        # Save all results to a single JSON file
        with open("home_analyze_data.json", "w") as json_file:
            json.dump(results, json_file, indent=4)
        
        logging.info("All data successfully scraped and saved to home_analyze_data.json")

    except Exception as e:
        logging.error(f"An unexpected error occurred: {str(e)}")
        logging.error(traceback.format_exc())

    finally:
        driver.quit()

def extract_city_data(driver):
    city_data = []
    try:
        logging.info("Locating the city data table")
        table = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "table.filterableTable"))
        )
        rows = table.find_elements(By.TAG_NAME, "tr")[1:]  # Skip header row
        logging.info(f"Found {len(rows)} rows in the city data table")
        for row in rows:
            cols = row.find_elements(By.TAG_NAME, "td")
            if len(cols) >= 3:
                city = cols[0].text.strip().split('. ', 1)[-1]
                avg_list_price = cols[1].text.strip()
                avg_price_per_sqft = cols[2].text.strip()
                city_data.append({
                    "city": city,
                    "avg_list_price": avg_list_price,
                    "avg_price_per_sqft": avg_price_per_sqft
                })
        logging.info(f"Extracted data for {len(city_data)} cities")
    except Exception as e:
        logging.error(f"An error occurred while extracting city data: {str(e)}")
        logging.error(traceback.format_exc())
    return city_data

# Example usage
if __name__ == "__main__":
    state_urls = [
    "https://www.redfin.com/state/California",
    "https://www.redfin.com/state/Texas",
    "https://www.redfin.com/state/New-York",
    "https://www.redfin.com/state/Florida",
    "https://www.redfin.com/state/Illinois",
    "https://www.redfin.com/state/Pennsylvania",
    "https://www.redfin.com/state/Ohio",
    "https://www.redfin.com/state/Georgia",
    "https://www.redfin.com/state/North-Carolina",
    "https://www.redfin.com/state/Michigan",
    "https://www.redfin.com/state/New-Jersey",
    "https://www.redfin.com/state/Virginia",
    "https://www.redfin.com/state/Washington",
    "https://www.redfin.com/state/Massachusetts",
    "https://www.redfin.com/state/Arizona",
    "https://www.redfin.com/state/Colorado",
    "https://www.redfin.com/state/Tennessee",
    "https://www.redfin.com/state/Indiana",
    "https://www.redfin.com/state/Missouri",
    "https://www.redfin.com/state/Minnesota",
    "https://www.redfin.com/state/Wisconsin",
    "https://www.redfin.com/state/Nevada",
    "https://www.redfin.com/state/Maryland",
    "https://www.redfin.com/state/South-Carolina",
    "https://www.redfin.com/state/Oregon",
    "https://www.redfin.com/state/Kentucky",
    "https://www.redfin.com/state/Louisiana",
    "https://www.redfin.com/state/Alabama",
    "https://www.redfin.com/state/Iowa",
    "https://www.redfin.com/state/Connecticut",
    "https://www.redfin.com/state/Oklahoma",
    "https://www.redfin.com/state/Kansas",
    "https://www.redfin.com/state/Arkansas",
    "https://www.redfin.com/state/Utah",
    "https://www.redfin.com/state/Mississippi",
    "https://www.redfin.com/state/Nebraska",
    "https://www.redfin.com/state/New-Mexico",
    "https://www.redfin.com/state/West-Virginia",
    "https://www.redfin.com/state/Hawaii",
    "https://www.redfin.com/state/Rhode-Island",
    "https://www.redfin.com/state/Idaho",
    "https://www.redfin.com/state/Delaware",
    "https://www.redfin.com/state/North-Dakota",
    "https://www.redfin.com/state/South-Dakota",
    "https://www.redfin.com/state/Montana",
    "https://www.redfin.com/state/Maine",
    "https://www.redfin.com/state/New-Hampshire",
    "https://www.redfin.com/state/Alaska",
    "https://www.redfin.com/state/Vermont",
    "https://www.redfin.com/state/Wyoming"
]

    
    if state_urls:
        scrape_redfin_states(state_urls)
    else:
        logging.warning("No URLs provided. Exiting.")