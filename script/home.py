from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import json
import time

def setup_driver():
    chrome_options = Options()
    # chrome_options.add_argument("--headless")  # Uncomment to run in headless mode
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=chrome_options)
    return driver

def create_json(filename='home_data.json'):
    with open(filename, 'w', encoding='utf-8') as jsonfile:
        json.dump([], jsonfile)

def append_to_json(property_data, filename='home_data.json'):
    with open(filename, 'r+', encoding='utf-8') as jsonfile:
        data = json.load(jsonfile)
        data.append(property_data)
        jsonfile.seek(0)
        json.dump(data, jsonfile, indent=2)
        jsonfile.truncate()

def scrape_redfin_properties(driver, url, json_filename, city_name):
    driver.get(url)
    time.sleep(5)  # Wait for the page to load
    
    properties_count = 0
    last_height = driver.execute_script("return document.body.scrollHeight")
    
    while True:
        # Wait for the property cards to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div.MapHomeCardReact"))
        )
        
        property_cards = driver.find_elements(By.CSS_SELECTOR, "div.MapHomeCardReact")
        
        for card in property_cards:
            try:
                home_url = card.find_element(By.CSS_SELECTOR, "a.link-and-anchor").get_attribute("href")
                try:
                    image_link = card.find_element(By.CSS_SELECTOR, "img.bp-Homecard__Photo--image").get_attribute("src")
                except NoSuchElementException:
                    image_link = "https://ssl.cdn-redfin.com/photo/92/islphoto/870/genIslnoResize.3231870_0.jpg"
                address = card.find_element(By.CSS_SELECTOR, "div.bp-Homecard__Address").text
                price = card.find_element(By.CSS_SELECTOR, "span.bp-Homecard__Price--value").text
                stats = card.find_element(By.CSS_SELECTOR, "div.bp-Homecard__Stats")
                beds = stats.find_element(By.CSS_SELECTOR, "span.bp-Homecard__Stats--beds").text
                baths = stats.find_element(By.CSS_SELECTOR, "span.bp-Homecard__Stats--baths").text
                area = stats.find_element(By.CSS_SELECTOR, "span.bp-Homecard__LockedStat--value").text
                
                property_data = {
                    'home_url': home_url,
                    'image_link': image_link,
                    'address': address,
                    'price': price,
                    'beds': beds,
                    'baths': baths,
                    'area': area,
                    'city' : city_name
                }
                
                append_to_json(property_data, json_filename)
                properties_count += 1
                print(f"Property {properties_count} scraped and saved.")
            
            except Exception as e:
                if home_url:
                    print(f"Error scraping property: {home_url}")
                else:
                    print("Error scraping property: Unable to retrieve home URL")
                print(f"Error details:")
        
        # Scroll down to bottom
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        
        # Calculate new scroll height and compare with last scroll height
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            # If heights are the same, it means we've reached the end of the page
            break
        last_height = new_height
    
    return properties_count

# Main execution
base_urls = [
    "https://www.redfin.com/city/30818/TX/Austin",
    "https://www.redfin.com/city/30749/NY/New-York",
    "https://www.redfin.com/city/11203/CA/Los-Angeles",
    "https://www.redfin.com/city/16338/SD/Toronto",
    "https://www.redfin.com/city/12839/DC/Washington-DC",
    "",
    "",
    ""
]
driver = setup_driver()
json_filename = 'home_data.json'
create_json(json_filename)
total_properties = 0

try:
    for base_url in base_urls:
        city_name = base_url.split('/')[-1]
        print(f"Scraping properties in {city_name}")
        
        for page in range(1, 8):  # This will scrape pages 1 through 9
            url = f"{base_url}/page-{page}" if page > 1 else base_url
            print(f"Scraping {city_name} - page {page}...")
            properties_count = scrape_redfin_properties(driver, url, json_filename, city_name)
            
            total_properties += properties_count
            print(f"Total properties scraped in {city_name}: {properties_count}")
            print(f"Total properties scraped overall: {total_properties}")
            
            if page < 8:
                print("Waiting 5 seconds before moving to the next page...")
                time.sleep(5)  # Add a delay between pages to be more respectful to the server
        
        print(f"Finished scraping {city_name}. Waiting 10 seconds before moving to the next city...")
        time.sleep(10)  # Add a longer delay between cities

finally:
    driver.quit()

print(f"Scraped {total_properties} properties and saved to {json_filename}")