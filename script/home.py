from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException, TimeoutException, WebDriverException
import json
import time

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

# def scrape_redfin_properties(driver, url, json_filename, city_name):
#     if driver is None:
#         print("Driver not initialized. Skipping URL:", url)
#         return 0
        
#     properties_count = 0
#     try:
#         driver.get(url)
#         time.sleep(5)  # Wait for the page to load
        
#         last_height = driver.execute_script("return document.body.scrollHeight")
        
#         while True:
#             try:
#                 # Wait for the property cards to load
#                 WebDriverWait(driver, 10).until(
#                     EC.presence_of_element_located((By.CSS_SELECTOR, "div.MapHomeCardReact"))
#                 )
                
#                 property_cards = driver.find_elements(By.CSS_SELECTOR, "div.MapHomeCardReact")
                
#                 for card in property_cards:
#                     try:
#                         home_url = card.find_element(By.CSS_SELECTOR, "a.link-and-anchor").get_attribute("href")
#                         try:
#                             image_link = card.find_element(By.CSS_SELECTOR, "img.bp-Homecard__Photo--image").get_attribute("src")
#                         except NoSuchElementException:
#                             image_link = "https://ssl.cdn-redfin.com/photo/92/islphoto/870/genIslnoResize.3231870_0.jpg"
                        
#                         try:
#                             address = card.find_element(By.CSS_SELECTOR, "div.bp-Homecard__Address").text
#                             price = card.find_element(By.CSS_SELECTOR, "span.bp-Homecard__Price--value").text
#                             stats = card.find_element(By.CSS_SELECTOR, "div.bp-Homecard__Stats")
#                             beds = stats.find_element(By.CSS_SELECTOR, "span.bp-Homecard__Stats--beds").text
#                             baths = stats.find_element(By.CSS_SELECTOR, "span.bp-Homecard__Stats--baths").text
#                             area = stats.find_element(By.CSS_SELECTOR, "span.bp-Homecard__LockedStat--value").text
                            
#                             property_data = {
#                                 'home_url': home_url,
#                                 'image_link': image_link,
#                                 'address': address,
#                                 'price': price,
#                                 'beds': beds,
#                                 'baths': baths,
#                                 'area': area,
#                                 'city': city_name
#                             }
                            
#                             append_to_json(property_data, json_filename)
#                             properties_count += 1
#                             print(f"Property {properties_count} scraped and saved.")
                            
#                         except NoSuchElementException as e:
#                             print(f"Skipping property due to missing data: {str(e)}")
#                             continue
                            
#                     except Exception as e:
#                         print(f"Error scraping individual property: {str(e)}")
#                         continue
                
#                 # Scroll down to bottom
#                 driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
#                 time.sleep(2)
                
#                 # Calculate new scroll height and compare with last scroll height
#                 new_height = driver.execute_script("return document.body.scrollHeight")
#                 if new_height == last_height:
#                     break
#                 last_height = new_height
                
#             except TimeoutException:
#                 print(f"Timeout while loading property cards for {url}. Moving to next page.")
#                 break
                
#     except WebDriverException as e:
#         print(f"WebDriver error for {url}: {str(e)}")
#     except Exception as e:
#         print(f"Unexpected error while scraping {url}: {str(e)}")
    
#     return properties_count


def scrape_redfin_properties(driver, url, json_filename, city_name):
    if driver is None:
        print("Driver not initialized. Skipping URL:", url)
        return 0
        
    properties_count = 0
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
                            
                            # Extract JSON-LD data from the card
                            try:
                                script_element = card.find_element(By.XPATH, ".//script[@type='application/ld+json']")
                                json_ld_content = script_element.get_attribute('innerHTML')
                                json_ld_data = json.loads(json_ld_content)
                                
                                # Extract relevant information from JSON-LD
                                property_details = json_ld_data[0]  # Assuming the first object contains property details
                                latitude = property_details.get('geo', {}).get('latitude')
                                longitude = property_details.get('geo', {}).get('longitude')
                                floor_size = property_details.get('floorSize', {}).get('value')
                                number_of_rooms = property_details.get('numberOfRooms')
                                
                                # Extract address details
                                address_details = property_details.get('address', {})
                                street_address = address_details.get('streetAddress')
                                address_locality = address_details.get('addressLocality')
                                address_region = address_details.get('addressRegion')
                                postal_code = address_details.get('postalCode')
                                address_country = address_details.get('addressCountry')
                                
                                offer_details = json_ld_data[1]  # Assuming the second object contains offer details
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
                                'city': city_name,
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
    
    return properties_count

# Main execution
base_urls = [
    "https://www.redfin.com/city/30818/TX/Austin",
    "https://www.redfin.com/city/30749/NY/New-York",
    "https://www.redfin.com/city/11203/CA/Los-Angeles",
    "https://www.redfin.com/city/16338/SD/Toronto",
    "https://www.redfin.com/city/12839/DC/Washington-DC",
    "https://www.redfin.com/city/29470/IL/Chicago",
    "https://www.redfin.com/city/17151/CA/San-Francisco",
    "https://www.redfin.com/city/8903/TX/Houston",
    "https://www.redfin.com/city/1826/MA/Boston"
    "https://www.redfin.com/city/30794/TX/Dallas",
    "https://www.redfin.com/city/30756/GA/Atlanta",
    "https://www.redfin.com/city/11458/FL/Miami",
    "https://www.redfin.com/city/15502/PA/Philadelphia",
    "https://www.redfin.com/city/16163/WA/Seattle",
    "https://www.redfin.com/city/16904/CA/San-Diego",
    "https://www.redfin.com/city/5155/CO/Denver",
    "https://www.redfin.com/city/14240/AZ/Phoenix",
    "https://www.redfin.com/city/10943/MN/Minneapolis",
    "https://www.redfin.com/city/5665/MI/Detroit",
    "https://www.redfin.com/city/17420/CA/San-Jose",
    "https://www.redfin.com/city/10201/NV/Las-Vegas",
    "https://www.redfin.com/city/3105/NC/Charlotte",
    "https://www.redfin.com/city/30772/OR/Portland",
    "https://www.redfin.com/city/13415/TN/Nashville",
    "https://www.redfin.com/city/18142/FL/Tampa",
    "https://www.redfin.com/city/9170/IN/Indianapolis",
    "https://www.redfin.com/city/1073/MD/Baltimore",
    "https://www.redfin.com/city/14233/LA/New-Orleans",
    "https://www.redfin.com/city/17150/UT/Salt-Lake-City",
    "https://www.redfin.com/city/16657/TX/San-Antonio",
    "https://www.redfin.com/city/15702/PA/Pittsburgh",
    "https://www.redfin.com/city/3879/OH/Cincinnati",
    "https://www.redfin.com/city/16661/MO/St-Louis",
    "https://www.redfin.com/city/4145/OH/Cleveland",
    "https://www.redfin.com/city/35751/MO/Kansas-City",
    "https://www.redfin.com/city/4664/OH/Columbus",
    "https://www.redfin.com/city/16409/CA/Sacramento",
    "https://www.redfin.com/city/35759/WI/Milwaukee",
    "https://www.redfin.com/city/35711/NC/Raleigh",
    "https://www.redfin.com/city/12260/TN/Memphis",
    "https://www.redfin.com/city/14237/OK/Oklahoma-City",
    "https://www.redfin.com/city/17149/VA/Richmond",
]


driver = setup_driver()
json_filename = 'home_data.json'
create_json(json_filename)
total_properties = 0

try:
    for base_url in base_urls:
        try:
            city_name = base_url.split('/')[-1]
            print(f"\nStarting to scrape properties in {city_name}")
            
            for page in range(1, 8):
                try:
                    url = f"{base_url}/page-{page}" if page > 1 else base_url
                    print(f"Scraping {city_name} - page {page}...")
                    properties_count = scrape_redfin_properties(driver, url, json_filename, city_name)
                    
                    total_properties += properties_count
                    print(f"Total properties scraped in {city_name}: {properties_count}")
                    print(f"Total properties scraped overall: {total_properties}")
                    
                    if page < 8:
                        print("Waiting 5 seconds before next page...")
                        time.sleep(2)
                
                except Exception as e:
                    print(f"Error on page {page} of {city_name}: {str(e)}")
                    continue
            
            print(f"Finished scraping {city_name}. Waiting 10 seconds before next city...")
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