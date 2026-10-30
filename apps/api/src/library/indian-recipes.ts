/** Original, weighed recipe formulations. All quantities are grams of edible raw/dry
 * ingredients unless the ingredient name says cooked. Water is included in instructions
 * and adds no nutrients. Variants are explicit, not guessed from a dish's name. These
 * are editable cooking formulations, not clinical prescriptions or restaurant averages.
 * Dish names/classifications originate in indian-dishes-reference.json; no Coachway
 * recipe text or media is republished. */
export const RECIPE_INGREDIENTS: Record<string, string[]> = {
  rice: ["Rice, white, long-grain, regular, raw, unenriched"],
  flattenedRice: ["Rice flakes"],
  semolina: ["Semolina, unenriched"],
  urad: ["Black gram, dal", "Black gram, whole"],
  moong: ["Green gram, dal", "Green gram, whole"],
  toor: ["Red gram, dal"],
  chanaDal: ["Bengal gram, dal"],
  chickpeas: ["Chickpeas (garbanzo beans, bengal gram), mature seeds, raw"],
  kidneyBeans: ["Beans, kidney, red, mature seeds, raw"],
  besan: ["Chickpea flour (besan)"],
  flour: ["Wheat flour, whole-grain (Includes foods for USDA's Food Distribution Program)"],
  whiteFlour: ["Wheat flour, white, all-purpose, unenriched"],
  oats: ["Cereals, oats, regular and quick, not fortified, dry"],
  ragi: ["Ragi"],
  vermicelli: ["Pasta, dry, unenriched"],
  oil: ["Oil, sunflower, linoleic (less than 60%)"],
  ghee: ["Butter oil, anhydrous"],
  onion: ["Onions, raw"],
  tomato: ["Tomatoes, red, ripe, raw, year round average"],
  potato: ["Potatoes, flesh and skin, raw"],
  carrot: ["Carrots, raw"],
  peas: ["Peas, green, raw"],
  cauliflower: ["Cauliflower, raw"],
  spinach: ["Spinach, raw"],
  fenugreek: ["Fenugreek leaves"],
  okra: ["Okra, raw"],
  eggplant: ["Eggplant, raw"],
  lauki: ["Bottle gourd, elongate, pale green"],
  pepper: ["Peppers, sweet, green, raw"],
  beans: ["Beans, snap, green, raw"],
  cucumber: ["Cucumber, with peel, raw"],
  mushroom: ["Mushrooms, white, raw"],
  corn: ["Corn, sweet, yellow, raw"],
  paneer: ["Paneer"],
  yogurt: ["Yogurt, plain, whole milk"],
  milk: ["Milk, whole, 3.25% milkfat, with added vitamin D"],
  cream: ["Cream, fluid, heavy whipping"],
  butter: ["Butter, without salt"],
  egg: ["Egg, whole, raw, fresh"],
  eggWhite: ["Egg, white, raw, fresh"],
  chicken: ["Chicken, broiler or fryers, breast, skinless, boneless, meat only, raw"],
  mutton: ["Game meat, goat, raw"],
  fish: ["Fish, tilapia, raw"],
  hilsa: ["Hilsa"],
  prawn: ["Prawns, big"],
  coconut: ["Nuts, coconut meat, raw"],
  coconutMilk: ["Nuts, coconut milk, raw (liquid expressed from grated meat and water)"],
  peanuts: ["Peanuts, all types, raw"],
  cashew: ["Nuts, cashew nuts, raw"],
  almonds: ["Nuts, almonds"],
  ginger: ["Ginger root, raw"],
  garlic: ["Garlic, raw"],
  lemon: ["Lemon juice, raw"],
  cumin: ["Spices, cumin seed"],
  turmeric: ["Spices, turmeric, ground"],
  coriander: ["Spices, coriander seed"],
  chili: ["Spices, chili powder"],
  peppercorn: ["Spices, pepper, black"],
  mustard: ["Spices, mustard seed, ground"],
  cardamom: ["Spices, cardamom"],
  cinnamon: ["Spices, cinnamon, ground"],
  sugar: ["Sugars, granulated"],
  mango: ["Mangos, raw"],
  banana: ["Bananas, raw"],
  apple: ["Apples, raw, with skin (Includes foods for USDA's Food Distribution Program)"],
  papaya: ["Papayas, raw"],
  dates: ["Dates, deglet noor"],
  bread: ["Bread, whole-wheat, commercially prepared"],
  pav: ["Rolls, hamburger or hotdog, plain"],
  tea: ["Beverages, tea, black, brewed, prepared with tap water"],
  coconutWater: ["Nuts, coconut water (liquid from coconuts)"],
  poppy: ["Spices, poppy seed"],
  soy: ["Soya chunks, dry (Nutrela label)"],
  makhana: ["Makhana, popped, plain"],
};
// title | servings | prep minutes | cook minutes | ingredients | method
// The method selects freshly authored cooking instructions below, never nutrition.
const DATA = `
Poha|2|10|15|flattenedRice:120,onion:60,peas:40,peanuts:20,oil:10,mustard:2,turmeric:1,lemon:10|poha
Upma|2|10|15|semolina:100,onion:60,carrot:50,peas:40,oil:10,mustard:2|upma
Idli with Sambar|2|600|30|rice:90,urad:30,toor:40,tomato:80,carrot:60,oil:5,turmeric:1|idli
Masala Dosa|2|600|25|rice:100,urad:30,potato:180,onion:60,oil:15,mustard:2,turmeric:1|dosa
Plain Dosa with Chutney|2|600|20|rice:100,urad:30,coconut:40,chanaDal:15,oil:10|dosa
Uttapam|2|600|20|rice:100,urad:30,onion:80,tomato:80,pepper:40,oil:10|uttapam
Medu Vada|2|240|20|urad:120,onion:40,ginger:5,oil:25,cumin:2|vada
Pongal|2|10|25|rice:90,moong:45,ghee:12,cashew:15,peppercorn:2,cumin:2|khichdi
Aloo Paratha with Curd|2|20|20|flour:120,potato:180,yogurt:150,oil:10,cumin:2,chili:1|paratha
Paneer Paratha|2|20|20|flour:120,paneer:120,onion:40,oil:10,cumin:2|paratha
Methi Paratha|2|15|20|flour:120,fenugreek:70,yogurt:30,oil:10,cumin:2|flatbread
Besan Chilla|2|10|15|besan:100,onion:60,tomato:60,oil:10,cumin:2,turmeric:1|chilla
Moong Dal Chilla|2|240|20|moong:120,ginger:5,onion:60,oil:10,cumin:2|chilla
Masala Omelette|1|5|10|egg:100,onion:30,tomato:30,oil:5,chili:1|omelette
Egg Bhurji with Toast|1|5|10|egg:100,onion:40,tomato:50,oil:5,bread:60,turmeric:1|bhurji
Boiled Eggs with Masala Toast|1|5|12|egg:100,bread:60,butter:5,chili:1|boiled
Vermicelli Upma (Semiya)|2|10|15|vermicelli:100,onion:50,carrot:50,peas:40,oil:10,mustard:2|upma
Thepla with Curd|2|15|20|flour:100,besan:30,fenugreek:60,yogurt:150,oil:10,turmeric:1|flatbread
Dhokla|2|15|20|besan:120,yogurt:60,lemon:15,sugar:5,oil:10,mustard:2|dhokla
Khakra with Pickle|2|20|25|flour:100,oil:10,cumin:2,mango:30,mustard:2,chili:2|khakra
Sattu Paratha|2|20|20|flour:120,chanaDal:70,onion:40,lemon:10,oil:10,cumin:2|sattu
Luchi with Aloo Dum|2|20|30|whiteFlour:120,potato:200,tomato:80,yogurt:40,oil:25,cumin:2,chili:1|luchi
Overnight Oats with Mango|1|10|0|oats:50,milk:150,yogurt:80,mango:100|overnight
Sprouts Salad Bowl|2|1440|10|moong:80,cucumber:100,tomato:100,onion:40,lemon:20|sprouts
Ragi Dosa|2|15|20|ragi:80,rice:40,yogurt:60,onion:50,oil:10,cumin:2|ragi
Dal Tadka with Rice|2|15|30|toor:100,rice:100,onion:60,tomato:100,oil:10,cumin:2,turmeric:1,garlic:5|dalrice
Dal Makhani|2|480|60|urad:100,kidneyBeans:30,tomato:120,butter:12,cream:25,ginger:5,garlic:5|bean
Rajma Chawal|2|480|50|kidneyBeans:120,rice:100,onion:80,tomato:120,oil:10,cumin:2,ginger:5|beanrice
Chole Bhature|2|480|45|chickpeas:120,whiteFlour:120,yogurt:40,onion:80,tomato:100,oil:30,cumin:2|bhature
Chana Masala with Roti|2|480|45|chickpeas:120,flour:100,onion:80,tomato:100,oil:10,cumin:2,chili:1|beanroti
Palak Paneer with Roti|2|15|25|paneer:180,spinach:250,flour:100,onion:60,tomato:80,oil:10,garlic:5|palak
Paneer Butter Masala|2|15|25|paneer:200,tomato:200,onion:60,cashew:20,butter:12,cream:25,chili:1|curry
Kadai Paneer|2|15|25|paneer:200,pepper:120,onion:100,tomato:150,oil:10,coriander:3,cumin:2|curry
Shahi Paneer|2|15|25|paneer:200,onion:100,cashew:25,milk:100,cream:20,ghee:10,cardamom:1|curry
Mix Vegetable Sabzi with Roti|2|15|25|carrot:100,beans:100,peas:60,cauliflower:120,flour:100,oil:10,cumin:2|sabziroti
Bhindi Masala|2|15|20|okra:300,onion:100,tomato:80,oil:15,coriander:3,turmeric:1|sabzi
Baingan Bharta|2|10|35|eggplant:400,onion:80,tomato:120,oil:12,garlic:6,cumin:2|bharta
Aloo Gobi|2|15|25|potato:200,cauliflower:250,onion:60,tomato:80,oil:12,turmeric:1,cumin:2|sabzi
Aloo Matar|2|15|25|potato:220,peas:120,onion:60,tomato:100,oil:10,cumin:2|curry
Lauki Sabzi|2|10|25|lauki:400,onion:60,tomato:100,oil:10,cumin:2,turmeric:1|sabzi
Kadhi Pakora with Rice|2|15|35|yogurt:250,besan:70,onion:60,rice:100,oil:20,cumin:2,turmeric:1|kadhi
Vegetable Biryani|2|30|35|rice:140,carrot:80,beans:80,peas:60,onion:100,yogurt:60,oil:12,cumin:2,cinnamon:1|biryani
Chicken Biryani|2|45|40|rice:140,chicken:250,onion:100,tomato:80,yogurt:80,oil:15,cumin:2,cinnamon:1|biryani
Hyderabadi Mutton Biryani|2|90|70|rice:140,mutton:250,onion:100,yogurt:100,oil:15,ginger:8,garlic:8,cinnamon:1|biryani
Egg Biryani|2|20|35|rice:140,egg:200,onion:100,tomato:80,yogurt:60,oil:12,cumin:2|biryani
Butter Chicken with Naan|2|60|35|chicken:250,tomato:200,yogurt:80,cream:30,butter:15,whiteFlour:120,milk:40,garlic:6,chili:2|butternaan
Chicken Tikka Masala|2|60|35|chicken:300,yogurt:80,onion:100,tomato:200,cream:20,oil:12,ginger:8,garlic:8|tikkacurry
Chicken Curry with Rice|2|15|35|chicken:300,rice:120,onion:100,tomato:150,oil:12,ginger:8,garlic:8,turmeric:1|curryrice
Kadai Chicken|2|15|35|chicken:300,pepper:150,onion:100,tomato:150,oil:12,coriander:3,cumin:2|curry
Chicken Korma|2|30|35|chicken:300,yogurt:120,onion:100,cashew:25,oil:12,cardamom:1|curry
Tandoori Chicken|2|120|30|chicken:350,yogurt:100,lemon:20,oil:10,ginger:10,garlic:10,chili:3,cumin:2|grill
Egg Curry with Rice|2|10|30|egg:200,rice:120,onion:100,tomato:150,oil:12,cumin:2,turmeric:1|eggcurry
Mutton Rogan Josh|2|30|75|mutton:350,yogurt:100,onion:100,oil:15,chili:3,ginger:8,cardamom:1|curry
Fish Curry with Rice|2|15|25|fish:300,rice:120,tomato:150,onion:80,oil:12,turmeric:1,cumin:2|curryrice
Goan Fish Curry|2|15|25|fish:300,coconutMilk:150,tomato:100,onion:80,oil:10,lemon:15,chili:2|curry
Prawn Masala|2|15|20|prawn:300,onion:100,tomato:150,oil:12,ginger:8,garlic:8,chili:2|curry
Sambar Rice|2|15|35|toor:80,rice:120,carrot:100,tomato:120,onion:60,oil:10,mustard:2,coriander:3|dalrice
Curd Rice|2|10|25|rice:120,yogurt:250,milk:60,cucumber:80,oil:8,mustard:2,ginger:5|curdrice
Lemon Rice|2|10|25|rice:140,lemon:30,peanuts:25,oil:12,mustard:2,turmeric:1|lemonrice
Rasam with Rice|2|10|25|rice:120,tomato:200,toor:20,oil:8,peppercorn:2,cumin:2,garlic:5,lemon:20|dalrice
Avial|2|15|25|carrot:100,beans:100,potato:100,lauki:100,coconut:60,yogurt:100,oil:8,cumin:2|avial
Chettinad Chicken Curry|2|20|35|chicken:300,onion:100,tomato:120,coconut:40,oil:12,peppercorn:3,coriander:3,cumin:2|curry
Kerala Fish Molee|2|15|25|fish:300,coconutMilk:180,onion:100,tomato:80,oil:10,ginger:8,turmeric:1|curry
Pav Bhaji|2|15|30|potato:180,cauliflower:120,peas:60,tomato:150,onion:100,pepper:80,butter:15,pav:140,chili:2|pavbhaji
Misal Pav|2|1440|30|moong:100,onion:100,tomato:120,peanuts:20,oil:12,pav:140,chili:3,cumin:2|misal
Usal|2|1440|25|moong:120,onion:100,tomato:100,coconut:30,oil:10,mustard:2,turmeric:1|sproutcurry
Gujarati Kadhi with Khichdi|2|15|35|rice:90,moong:50,yogurt:250,besan:25,ghee:10,sugar:8,cumin:2,ginger:5|kadhikhichdi
Undhiyu|2|25|40|eggplant:100,potato:120,beans:100,peas:80,fenugreek:50,besan:40,coconut:30,oil:18,cumin:2|undhiyu
Dal Dhokli|2|15|40|toor:100,flour:100,peanuts:20,tomato:100,oil:12,cumin:2,turmeric:1|daldhokli
Bengali Fish Curry (Macher Jhol)|2|15|30|fish:300,potato:150,tomato:100,oil:15,turmeric:2,cumin:2|curry
Shorshe Ilish|2|15|25|hilsa:300,mustard:20,yogurt:60,oil:12,turmeric:1,chili:2|curry
Aloo Posto|2|30|25|potato:300,poppy:35,oil:12,cumin:2,chili:1|posto
Chingri Malai Curry|2|15|25|prawn:300,coconutMilk:180,onion:100,oil:12,turmeric:1,cardamom:1|curry
Khichdi with Ghee|2|10|30|rice:100,moong:70,ghee:15,cumin:2,turmeric:1|khichdi
Jeera Rice with Dal Fry|2|15|35|rice:120,toor:100,onion:60,tomato:100,ghee:12,cumin:4,turmeric:1|dalrice
Rogani Roti with Mixed Sabzi|2|20|30|flour:120,milk:50,ghee:12,carrot:100,beans:100,peas:80,oil:8,cumin:2|sabziroti
Paneer Tikka|2|60|20|paneer:250,yogurt:80,pepper:120,onion:100,oil:10,lemon:15,cumin:2,chili:2|grill
Malai Kofta|2|25|35|paneer:120,potato:150,whiteFlour:15,tomato:180,onion:80,cashew:20,cream:30,oil:20|kofta
Mushroom Masala|2|15|25|mushroom:300,onion:100,tomato:150,yogurt:60,oil:12,cumin:2|curry
Soya Chunk Curry|2|15|30|soy:100,onion:100,tomato:150,yogurt:60,oil:12,cumin:2,chili:1|soycurry
Egg Fried Rice, Indian-Style|2|15|25|rice:130,egg:150,carrot:60,peas:50,onion:60,oil:12,peppercorn:1|friedrice
Chicken Fried Rice, Indian-Style|2|15|30|rice:130,chicken:200,carrot:60,peas:50,onion:60,oil:12,peppercorn:1|friedrice
Vegetable Pulao|2|15|25|rice:140,carrot:80,beans:80,peas:60,onion:80,oil:12,cumin:2,cinnamon:1|pulao
Methi Chicken|2|15|35|chicken:300,fenugreek:100,onion:100,tomato:150,yogurt:60,oil:12,garlic:8|curry
Jain Mix Vegetable (no onion-garlic)|2|15|25|cauliflower:200,peas:100,pepper:100,tomato:150,oil:12,cumin:2,turmeric:1|sabzi
Jain Dal Tadka (no onion-garlic)|2|15|30|toor:120,tomato:150,oil:12,cumin:3,turmeric:1,chili:1|dal
Lauki Chana Dal|2|120|30|lauki:300,chanaDal:100,tomato:100,oil:10,cumin:2,turmeric:1|dal
Toor Dal with Rice|2|15|30|toor:100,rice:120,tomato:100,oil:10,cumin:2,turmeric:1|dalrice
Moong Dal Khichdi|2|10|30|moong:90,rice:90,carrot:80,peas:60,ghee:10,cumin:2,turmeric:1|khichdi
Masala Chai with Rusk|2|5|10|tea:180,milk:150,sugar:12,bread:50,ginger:5,cardamom:1|chai
Roasted Chana|2|480|45|chickpeas:100,oil:5,cumin:2,chili:1|roastchana
Makhana (Fox Nuts), Roasted|2|5|10|makhana:50,ghee:8,cumin:1,peppercorn:1|roast
Masala Peanuts|2|10|20|peanuts:100,besan:25,oil:8,chili:2,turmeric:1|roast
Sprouts Chaat|2|1440|10|moong:80,onion:60,tomato:100,lemon:20,cumin:2|sprouts
Bhel Puri|2|15|15|rice:60,peanuts:25,potato:100,onion:60,tomato:80,dates:25,lemon:15,oil:5|bhel
Sev Puri|2|25|25|whiteFlour:60,besan:30,potato:120,onion:60,tomato:60,dates:25,oil:20,cumin:2|sevpuri
Pani Puri|2|30|30|semolina:60,whiteFlour:20,potato:150,chickpeas:40,lemon:25,cumin:3,oil:18|panipuri
Samosa with Chutney|2|25|30|whiteFlour:100,potato:180,peas:40,oil:25,cumin:2,lemon:15|samosa
Vegetable Cutlet|2|20|25|potato:180,carrot:80,peas:50,bread:30,oil:15,cumin:2|cutlet
Kachori|2|120|35|whiteFlour:100,moong:60,oil:25,cumin:2,coriander:2,chili:1|kachori
Pakora (Mixed Vegetable)|2|15|20|besan:100,onion:100,potato:100,spinach:60,oil:25,cumin:2,chili:1|pakora
Corn Chaat|2|10|10|corn:250,onion:50,tomato:80,lemon:20,cumin:2|salad
Kathi Roll, Paneer|2|20|25|flour:120,paneer:180,pepper:100,onion:80,yogurt:50,oil:12,chili:2|roll
Kathi Roll, Chicken|2|30|30|flour:120,chicken:250,pepper:100,onion:80,yogurt:60,oil:12,chili:2|roll
Masala Papad|2|120|25|urad:50,cumin:2,onion:60,tomato:80,lemon:15,oil:5|papad
Dahi Vada|2|240|25|urad:100,yogurt:250,sugar:10,cumin:3,chili:1,oil:20|dahivada
Idli Chilli (Leftover Idli Fried)|2|600|35|rice:90,urad:30,onion:100,pepper:100,tomato:80,oil:15,chili:2|chilliidli
Boiled Chana Chaat|2|480|35|chickpeas:120,onion:60,tomato:100,cucumber:80,lemon:20,cumin:2|chanachaat
Murukku|2|20|30|rice:80,urad:20,butter:8,oil:20,cumin:2|murukku
Khandvi|2|15|25|besan:80,yogurt:180,coconut:20,oil:10,mustard:2,turmeric:1|khandvi
Masala Buttermilk (Chaas)|2|5|0|yogurt:250,cumin:2,ginger:3|drink
Mango Lassi|2|10|0|yogurt:250,mango:200,milk:80,sugar:10|drink
Sweet Lassi|2|5|0|yogurt:300,milk:100,sugar:25,cardamom:1|drink
Coconut Water with Malai|1|5|0|coconutWater:250,coconut:25|drink
Banana Chips|2|10|25|banana:180,oil:20,turmeric:1|chips
Boondi Raita|2|15|20|yogurt:250,besan:50,oil:15,cumin:2,chili:1|boondi
Cucumber Raita|2|10|0|yogurt:250,cucumber:150,cumin:2|raita
Fruit Chaat|2|10|0|banana:100,apple:120,papaya:150,lemon:15,cumin:1|salad
Gulab Jamun|4|20|30|milk:500,whiteFlour:35,sugar:100,ghee:20,cardamom:1|jamun
Rasgulla|4|20|30|paneer:200,sugar:100,lemon:10|rasgulla
Gajar Ka Halwa|4|15|45|carrot:500,milk:400,sugar:50,ghee:20,cashew:15,cardamom:1|halwa
Kheer (Rice Pudding)|4|10|40|rice:70,milk:700,sugar:50,almonds:20,cardamom:1|kheer
Besan Ladoo|4|10|30|besan:120,ghee:50,sugar:60,cardamom:1|ladoo
Shrikhand|4|240|0|yogurt:500,sugar:60,cardamom:1,almonds:15|shrikhand
Mishti Doi|4|480|30|milk:600,yogurt:40,sugar:70|mishtidoi
Jalebi with Rabri|4|480|45|whiteFlour:100,yogurt:60,sugar:100,oil:25,milk:500,cardamom:1|jalebi
Protein Paneer Bhurji|2|10|15|paneer:250,onion:80,tomato:120,pepper:80,oil:10,turmeric:1|bhurji
Grilled Tandoori Paneer Salad|2|45|20|paneer:220,yogurt:80,cucumber:120,tomato:100,spinach:80,oil:8,lemon:20,chili:2|grillsalad
Grilled Tandoori Chicken Salad|2|45|25|chicken:300,yogurt:80,cucumber:120,tomato:100,spinach:80,oil:8,lemon:20,chili:2|grillsalad
Sprouted Moong Salad|2|1440|10|moong:100,cucumber:150,tomato:120,lemon:20,cumin:2|sprouts
Besan Cheela Roll with Paneer Stuffing|2|15|25|besan:100,paneer:160,onion:60,tomato:80,oil:10,cumin:2|cheelaroll
High-Protein Dal Tadka (extra lentils)|2|15|30|toor:100,moong:80,onion:80,tomato:120,oil:10,cumin:3,turmeric:1|dal
Egg White Bhurji|2|10|15|eggWhite:250,onion:80,tomato:100,pepper:80,oil:8,turmeric:1|bhurji
Low-Carb Cauliflower Rice Pulao|2|15|15|cauliflower:400,carrot:60,beans:80,peas:40,onion:80,oil:10,cumin:2|cauliflowerrice
Grilled Fish Tikka|2|45|20|fish:300,yogurt:80,lemon:20,oil:8,ginger:8,garlic:8,chili:2|grill
Paneer and Vegetable Skewers|2|30|20|paneer:200,pepper:150,onion:120,tomato:100,yogurt:60,oil:10,cumin:2|grill
`;
export const INDIAN_RECIPES = DATA.trim()
  .split("\n")
  .map((line) => {
    const [name, servings, prep, cook, amounts, method] = line.split("|");
    if (!name || !amounts || !method) throw new Error(`Invalid authored recipe: ${line}`);
    return {
      name,
      servings: Number(servings),
      prepMinutes: Number(prep),
      cookMinutes: Number(cook),
      method,
      ingredients: amounts.split(",").map((s) => {
        const [key, grams] = s.split(":");
        if (!key || !grams) throw new Error("Missing quantity");
        return { key, grams: Number(grams) };
      }),
    };
  });
