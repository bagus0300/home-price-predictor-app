from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException, TimeoutException, WebDriverException
import json
import time
import urllib.parse

def setup_driver():
    try:
        chrome_options = Options()
        # chrome_options.add_argument("--headless")  # Uncomment to run in headless mode
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        driver = webdriver.Chrome(options=chrome_options)
        return driver
    except Exception as e:
        print(f"Error setting up driver: {str(e)}")
        return None

def create_json(filename='home_data.json'):
    try:
        with open(filename, 'w', encoding='utf-8') as jsonfile:
            json.dump([], jsonfile)
    except Exception as e:
        print(f"Error creating JSON file: {str(e)}")

def append_to_json(property_data, filename='home_data.json'):
    try:
        with open(filename, 'r+', encoding='utf-8') as jsonfile:
            data = json.load(jsonfile)
            data.append(property_data)
            jsonfile.seek(0)
            json.dump(data, jsonfile, indent=2)
            jsonfile.truncate()
    except Exception as e:
        print(f"Error appending to JSON: {str(e)}")

def get_resolved_url(driver, base_url):
    try:
        driver.get(base_url)
        time.sleep(3)  # Wait for redirect
        resolved_url = driver.current_url
        
        # Extract the base URL without any page parameters
        parsed_url = urllib.parse.urlparse(resolved_url)
        path_parts = parsed_url.path.rstrip('/').split('/')
        
        # Reconstruct the base URL without any potential page numbers
        if 'page-' in path_parts[-1]:
            path_parts = path_parts[:-1]
        
        base_path = '/'.join(path_parts)
        resolved_base_url = f"{parsed_url.scheme}://{parsed_url.netloc}{base_path}"
        
        return resolved_base_url
    except Exception as e:
        print(f"Error resolving URL {base_url}: {str(e)}")
        return None

def extract_city_from_url(url):
    try:
        parts = url.split('/')
        for i, part in enumerate(parts):
            if len(part) == 2 and part.isupper():  # State code pattern
                return parts[i + 1]
    except Exception as e:
        print(f"Error extracting city from URL: {str(e)}")
        return None

def format_city(address_locality, address_region):
    try:
        if address_locality and address_region:
            return f"{address_locality}, {address_region}"
        return None
    except Exception as e:
        print(f"Error formatting city: {str(e)}")
        return None

def scrape_redfin_properties(driver, url, json_filename):
    if driver is None:
        print("Driver not initialized. Skipping URL:", url)
        return 0, False
        
    properties_count = 0
    duplicate_found = False
    try:
        driver.get(url)
        time.sleep(5)  # Wait for the page to load
        
        last_height = driver.execute_script("return document.body.scrollHeight")
        
        while True:
            try:
                # Wait for the property cards to load
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "div.MapHomeCardReact"))
                )
                
                property_cards = driver.find_elements(By.CSS_SELECTOR, "div.MapHomeCardReact")
                
                for card in property_cards:
                    try:
                        home_url = card.find_element(By.CSS_SELECTOR, "a.link-and-anchor").get_attribute("href")
                        
                        # Check if this home_url already exists in the JSON file
                        with open(json_filename, 'r', encoding='utf-8') as jsonfile:
                            existing_data = json.load(jsonfile)
                            if any(property['home_url'] == home_url for property in existing_data):
                                print(f"Duplicate home_url found: {home_url}")
                                duplicate_found = True
                                break
                        
                        try:
                            image_link = card.find_element(By.CSS_SELECTOR, "img.bp-Homecard__Photo--image").get_attribute("src")
                        except NoSuchElementException:
                            image_link = "https://ssl.cdn-redfin.com/photo/92/islphoto/870/genIslnoResize.3231870_0.jpg"
                        
                        try:
                            address = card.find_element(By.CSS_SELECTOR, "div.bp-Homecard__Address").text
                            price = card.find_element(By.CSS_SELECTOR, "span.bp-Homecard__Price--value").text
                            stats = card.find_element(By.CSS_SELECTOR, "div.bp-Homecard__Stats")
                            beds = stats.find_element(By.CSS_SELECTOR, "span.bp-Homecard__Stats--beds").text
                            baths = stats.find_element(By.CSS_SELECTOR, "span.bp-Homecard__Stats--baths").text
                            area = stats.find_element(By.CSS_SELECTOR, "span.bp-Homecard__LockedStat--value").text

                            # Extract JSON-LD data
                            try:
                                script_element = card.find_element(By.XPATH, ".//script[@type='application/ld+json']")
                                json_ld_content = script_element.get_attribute('innerHTML')
                                json_ld_data = json.loads(json_ld_content)
                                
                                property_details = json_ld_data[0]
                                latitude = property_details.get('geo', {}).get('latitude')
                                longitude = property_details.get('geo', {}).get('longitude')
                                floor_size = property_details.get('floorSize', {}).get('value')
                                number_of_rooms = property_details.get('numberOfRooms')
                                
                                address_details = property_details.get('address', {})
                                street_address = address_details.get('streetAddress')
                                address_locality = address_details.get('addressLocality')
                                address_region = address_details.get('addressRegion')
                                postal_code = address_details.get('postalCode')
                                address_country = address_details.get('addressCountry')

                                formatted_city = format_city(address_locality, address_region)
                                
                                offer_details = json_ld_data[1]
                                price_value = offer_details.get('offers', {}).get('price')
                                
                            except Exception as e:
                                print(f"Error extracting JSON-LD data: {str(e)}")
                                latitude = longitude = floor_size = price_value = number_of_rooms = None
                                street_address = address_locality = address_region = postal_code = address_country = None
                            
                            property_data = {
                                'home_url': home_url,
                                'image_link': image_link,
                                'address': address,
                                'price': price,
                                'beds': beds,
                                'baths': baths,
                                'area': area,
                                'city': formatted_city,
                                'latitude': latitude,
                                'longitude': longitude,
                                'floor_size': floor_size,
                                'price_value': price_value,
                                'number_of_rooms': number_of_rooms,
                                'street_address': street_address,
                                'address_locality': address_locality,
                                'address_region': address_region,
                                'postal_code': postal_code,
                                'address_country': address_country
                            }
                            
                            append_to_json(property_data, json_filename)
                            properties_count += 1
                            print(f"Property {properties_count} scraped and saved.")
                            
                        except NoSuchElementException as e:
                            print(f"Skipping property due to missing data: {str(e)}")
                            continue
                            
                    except Exception as e:
                        print(f"Error scraping individual property: {str(e)}")
                        continue
                
                if duplicate_found:
                    break
                
                # Scroll down to bottom
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)
                
                # Calculate new scroll height and compare with last scroll height
                new_height = driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height
                
            except TimeoutException:
                print(f"Timeout while loading property cards for {url}. Moving to next page.")
                break
                
    except WebDriverException as e:
        print(f"WebDriver error for {url}: {str(e)}")
    except Exception as e:
        print(f"Unexpected error while scraping {url}: {str(e)}")
    
    return properties_count, duplicate_found

# Main execution
def main():
    # You can uncomment the every_base_urls list if you want to use specific cities
    
    
    # Generate URLs for all city IDs
    base_urls = [f"https://www.redfin.com/city/{i}/" for i in range(3, 20001)]
    
    driver = setup_driver()
    json_filename = 'home_data.json'
    create_json(json_filename)
    total_properties = 0

    try:
        for base_url in base_urls:
            try:
                # Get the resolved URL first
                resolved_base_url = get_resolved_url(driver, base_url)
                if not resolved_base_url:
                    print(f"Skipping {base_url} - could not resolve URL")
                    continue
                    
                print(f"Resolved {base_url} to {resolved_base_url}")
                
                city_duplicate_found = False
                for page in range(1, 8):
                    try:
                        # Construct the page URL
                        if page > 1:
                            url = f"{resolved_base_url}/page-{page}"
                        else:
                            url = resolved_base_url
                            
                        print(f"Scraping {url}...")
                        properties_count, duplicate_found = scrape_redfin_properties(driver, url, json_filename)
                        
                        if duplicate_found:
                            city_duplicate_found = True
                            break
                        
                        total_properties += properties_count
                        print(f"Properties scraped on this page: {properties_count}")
                        print(f"Total properties scraped overall: {total_properties}")
                        
                        if page < 8:
                            print("Waiting 5 seconds before next page...")
                            time.sleep(2)
                    
                    except Exception as e:
                        print(f"Error on page {page} of {resolved_base_url}: {str(e)}")
                        continue
                
                if not city_duplicate_found:
                    print(f"Finished scraping city. Waiting 10 seconds before next city...")
                    time.sleep(2)
                
            except Exception as e:
                print(f"Error processing city {base_url}: {str(e)}")
                continue
                
    except Exception as e:
        print(f"Critical error in main execution: {str(e)}")
        
    finally:
        if driver:
            try:
                driver.quit()
            except Exception as e:
                print(f"Error closing driver: {str(e)}")

    print(f"Scraping completed. Total properties scraped: {total_properties}")

if __name__ == "__main__":
    main()