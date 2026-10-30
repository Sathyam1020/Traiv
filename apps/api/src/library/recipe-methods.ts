/** Original cooking text for the weighed formulations in indian-recipes.ts.
 * Each pipe separates an ordered instruction; salt and water can be adjusted to taste. */
const METHODS: Record<string, string> = {
  poha: "Rinse the rice flakes briefly, drain and rest until soft. Chop the vegetables.|Warm the oil, add mustard, then onion and turmeric. Stir in peas and peanuts and cook until the peas are tender.|Fold in the softened flakes, cover on low heat for 3–4 minutes, then add lemon juice and divide into servings.",
  upma: "Dry-roast the semolina or dry vermicelli until fragrant, then set aside.|Warm the oil, add mustard and chopped onion, then the remaining vegetables. Cook until tender.|Add hot water gradually, then stir in the roasted grain. Cover and simmer until the grain is cooked and the water absorbed.",
  idli: "Soak rice and urad separately for 4–6 hours. Grind with just enough water to make a thick batter, combine and ferment until risen.|Pour into greased idli moulds and steam for 10–15 minutes, until set. Rest before unmoulding.|Simmer the toor dal and vegetables in water until soft. Add turmeric and an oil tempering, then serve the sambar with the idli.",
  dosa: "Soak rice and urad separately for 4–6 hours. Grind with water, combine and ferment until risen. Thin to a pourable batter.|For masala dosa, boil and mash the potato, then cook with onion, mustard and turmeric in part of the oil. For plain dosa, blend coconut and cooked chana dal with water for chutney.|Spread batter thinly on a hot pan and use the measured oil around the edges. Cook until crisp and serve with the filling or chutney.",
  uttapam:
    "Soak rice and urad separately, grind with water and ferment the combined batter until risen.|Chop the onion, tomato and pepper finely. Spread thick rounds of batter on a warm pan and scatter the vegetables on top.|Use the measured oil around the edges. Cover, cook until set, flip and finish the other side.",
  vada: "Soak urad for 4 hours, drain well and grind to a thick, fluffy batter with minimal water.|Fold in finely chopped onion, ginger and cumin. Shape small rings using damp hands.|Shallow-fry small vada in the measured oil, turning until golden and cooked through. Serve hot.",
  khichdi:
    "Rinse the rice and lentils thoroughly. Chop any vegetables.|Warm ghee, toast the cumin and other whole spices, then add grain, lentils and vegetables.|Cover generously with water and simmer or pressure-cook until soft. Stir in cashews, if listed, and adjust the thickness with hot water.",
  paratha:
    "Knead the flour with water into a soft dough and rest for 15 minutes.|Cook and mash potato if listed, or crumble paneer. Mix with the listed chopped vegetables and spices to make a dry filling.|Stuff dough portions, seal and roll gently. Cook on a hot pan using the measured oil. Serve any listed curd alongside.",
  flatbread:
    "Finely chop the fenugreek. Mix with flour, besan if listed, spices and enough water to form a soft dough. Reserve most of the yogurt to serve alongside.|Rest the dough, divide into portions and roll thinly.|Cook both sides on a hot pan, brushing with the measured oil. Serve with the reserved curd.",
  chilla:
    "For moong chilla, soak the lentils for 4 hours and grind with water. For besan chilla, whisk the flour directly with water into a pourable batter.|Mix in chopped vegetables and spices. Rest for 10 minutes.|Spread rounds on a warm pan with the measured oil. Cook both sides until the centre is set.",
  omelette:
    "Beat the eggs with finely chopped vegetables and chilli.|Heat the measured oil in a pan and pour in the egg mixture.|Cook gently until the base sets, turn or fold, and cook until no liquid egg remains.",
  bhurji:
    "Chop the vegetables. Beat eggs or egg whites, or crumble paneer, according to the ingredient list.|Warm the oil, soften onion and pepper, then add tomato and turmeric.|Add the eggs or paneer and stir until cooked. Toast and serve the bread separately if listed.",
  boiled:
    "Boil the eggs until the yolks and whites are firm, then cool and peel.|Toast the bread and spread with the measured butter.|Sprinkle chilli over the eggs and serve with the toast.",
  dhokla:
    "Whisk besan, yogurt and water into a thick flowing batter. Add lemon juice and rest in a warm place until lightly aerated; this formulation uses natural fermentation rather than an unlisted raising agent.|Pour into a lightly oiled shallow tin and steam until the centre is set, about 15–20 minutes.|Warm the remaining oil with mustard seeds. Dissolve the sugar in a little hot water, add to the tempering and pour over the cut dhokla.",
  khakra:
    "Knead flour, cumin and part of the oil with water. Rest, then roll very thin rounds.|Toast slowly on a pan, pressing and turning until dry and crisp.|Dice the mango and toss with mustard, chilli and the remaining oil for a fresh pickle-style accompaniment.",
  sattu:
    "Dry-roast chana dal until fragrant, cool and grind finely. Mix with chopped onion, lemon, cumin and a little water to form a crumbly filling.|Knead flour with water, rest, then stuff dough portions with the filling and roll.|Cook on a hot pan using the measured oil, turning until both sides are cooked.",
  luchi:
    "Knead white flour with a little oil and water. Rest and roll small rounds.|Boil the potato. Cook tomato and spices in part of the oil, stir in yogurt and potato, then simmer until coated.|Fry small luchi in the remaining measured oil, turning as they puff, and serve with the potato curry.",
  overnight:
    "Mix oats, milk and yogurt in a covered container.|Refrigerate overnight until the oats soften.|Dice mango, fold it through the oats and serve chilled.",
  sprouts:
    "Soak whole moong overnight, drain and leave covered to sprout, rinsing and draining regularly.|Steam or simmer the sprouts until tender, then cool.|Toss with the chopped vegetables, lemon and cumin if listed. Divide into servings.",
  ragi: "Grind the listed dry rice into flour. Mix with ragi flour, yogurt, water, onion and cumin into a thin batter.|Rest for 15 minutes, then stir well.|Pour thinly onto a hot pan and cook both sides using the measured oil until crisp.",
  dalrice:
    "Rinse the rice and cook separately in water. Rinse the lentils and simmer or pressure-cook until soft.|Warm the oil or ghee with the listed spices, then cook onion and garlic if listed and the tomato until soft.|Combine the tempering and vegetables with the cooked lentils. Simmer together and serve with the rice.",
  dal: "Rinse the lentils and soak chana dal if listed. Simmer or pressure-cook with water until soft.|Warm the oil, toast cumin, then add only the vegetables and seasonings listed for this recipe.|Combine with the lentils and simmer. Add lauki during cooking if listed, so it becomes tender.",
  bean: "Soak whole beans or whole urad overnight, drain and boil in fresh water until completely tender.|Cook the listed aromatics and tomato in the butter or oil. Add ginger and garlic if listed.|Add beans with some cooking liquid, simmer until thick, then stir in the listed dairy ingredients. Whole urad gives a creamier texture than split dal.",
  beanrice:
    "Soak kidney beans overnight, drain and boil in fresh water until fully tender.|Cook onion, tomato and spices in oil. Add beans and cooking liquid and simmer until the sauce thickens.|Cook the rice separately and serve with the bean curry.",
  bhature:
    "Soak chickpeas overnight and boil in fresh water until tender.|Knead white flour with yogurt, a little oil and water. Rest until relaxed. Cook onion, tomato and cumin in part of the oil, then simmer with chickpeas.|Roll small dough rounds and fry in the remaining oil, turning until puffed and cooked. Serve with the chickpeas.",
  beanroti:
    "Soak chickpeas overnight, then boil in fresh water until tender.|Cook onion, tomato and spices in oil. Add chickpeas and a little cooking liquid and simmer.|Knead whole-wheat flour with water, roll roti and cook on a hot pan. Serve with the chickpea curry.",
  palak:
    "Wash spinach, blanch briefly and blend. Cube the paneer.|Soften onion and garlic in oil, add tomato and cook until thick. Stir in spinach and paneer and simmer gently.|Knead the flour with water, roll and cook roti on a hot pan. Serve with the palak paneer.",
  curry:
    "Cut the main protein or vegetables into even pieces. Soak and blend nuts or mustard seeds if listed, and mix any yogurt until smooth.|Warm the measured fat. Cook the listed onion, ginger and garlic if present, followed by tomato and spices. Add any blended nuts or coconut milk.|Add the main ingredients and a little water. Simmer until cooked through and tender; fish and prawns go in near the end. Stir cream in at the end if listed. Lamb needs a longer covered simmer.",
  sabzi:
    "Wash and cut the vegetables into even pieces.|Warm the oil, add cumin and the other spices, then onion and tomato if listed.|Add the remaining vegetables, cover and cook over medium-low heat, stirring and adding a splash of water as needed, until tender.",
  sabziroti:
    "Chop and cook the vegetables with the listed oil and spices until tender.|Knead flour with water and any listed milk. Rest, roll into roti and cook both sides on a hot pan.|Brush roti with ghee if listed and serve with the vegetables.",
  bharta:
    "Roast the whole eggplant until the skin chars and the flesh is soft. Cool, peel and mash.|Cook chopped onion, garlic, cumin and tomato in the measured oil.|Stir in the mashed eggplant and cook until excess moisture evaporates.",
  kadhi:
    "Reserve most of the besan for pakora and whisk the rest with yogurt, turmeric and water.|Mix reserved besan with onion, cumin and water. Shallow-fry small spoonfuls using the measured oil.|Simmer the yogurt mixture gently, stirring, until the besan is cooked. Add pakora just before serving with separately cooked rice.",
  biryani:
    "Rinse and soak rice for 20 minutes. Marinate any chicken or lamb in yogurt and spices; boil and peel eggs if listed.|Cook onion and the main ingredients in the measured oil, adding the listed tomato and spices. Cook meat until tender before layering.|Parboil and drain the rice, layer over the cooked base, cover tightly and steam on low heat until rice and filling are fully cooked. Rest before serving.",
  butternaan:
    "Marinate chicken in half the yogurt, garlic and chilli, then grill until cooked through.|Simmer tomato with butter, blend, then add chicken and cream. Knead flour with the remaining yogurt and milk, adding water as needed, and rest.|Roll naan and cook on a very hot covered pan, turning until cooked. Serve alongside the chicken.",
  tikkacurry:
    "Marinate chicken in yogurt, ginger, garlic and spices, then grill until cooked.|Cook onion and tomato in the measured oil, then blend the sauce if preferred.|Add the grilled chicken, simmer until hot throughout, and finish with cream.",
  curryrice:
    "Cook rice separately in water. Cut the fish or chicken into serving pieces.|Cook onion, tomato and the listed spices in the oil until softened.|Add the protein and a little water and simmer until cooked through. Serve with the rice.",
  eggcurry:
    "Boil the eggs until firm, cool and peel. Cook rice separately.|Cook onion, tomato and spices in the measured oil with a little water to form a sauce.|Add the eggs, simmer briefly and serve over rice.",
  grill:
    "Cut the protein and any vegetables into even pieces. Mix yogurt, spices, lemon if listed and oil into a marinade.|Coat and refrigerate for the prep time, then thread onto skewers or arrange on a grill tray.|Grill or roast, turning as needed, until the protein is cooked through and the vegetables are tender. Use all the measured marinade for the recipe.",
  curdrice:
    "Cook rice in water until soft and let it cool until no longer hot.|Mix yogurt, milk and chopped cucumber into the rice.|Warm oil with mustard and ginger, pour over the rice and stir. Serve promptly or refrigerate.",
  lemonrice:
    "Cook rice separately and spread out briefly so the grains separate.|Warm the oil, toast mustard and peanuts, then add turmeric.|Fold in rice and lemon juice and toss gently until evenly seasoned.",
  avial:
    "Cut the vegetables into similar batons and simmer with a little water until tender.|Grind coconut and cumin with water to a coarse paste and fold into the vegetables.|Lower the heat, stir in yogurt and the measured oil, and warm gently without boiling.",
  pavbhaji:
    "Boil potato, cauliflower and peas until soft, then mash.|Cook onion, pepper, tomato and chilli in most of the butter, add the mash and simmer with water to a thick consistency.|Toast the pav in the remaining butter and serve with the bhaji.",
  misal:
    "Soak and sprout whole moong, then simmer in fresh water until tender.|Cook onion, tomato, peanuts and spices in oil. Add sprouts and enough water to make a loose curry.|Simmer until combined and serve with pav. This formulation omits farsan, which is not included in the ingredient weights.",
  sproutcurry:
    "Soak and sprout whole moong, then simmer until tender.|Cook onion, tomato, coconut and spices in oil.|Stir in sprouts and a little cooking water, then simmer until the sauce coats them.",
  kadhikhichdi:
    "Cook rinsed rice and moong together with water until soft.|Whisk besan into yogurt and water. Simmer gently with ginger and sugar until the besan is cooked.|Temper cumin in ghee, add to the kadhi and serve with khichdi.",
  undhiyu:
    "Mix besan, finely chopped fenugreek, water and a little oil into a firm dough; form small dumplings.|Cut the vegetables and coat with coconut, cumin and the remaining oil.|Arrange vegetables and dumplings in a covered heavy pan with a little water. Cook slowly until tender, turning gently.",
  daldhokli:
    "Cook rinsed toor dal until soft. Knead flour with water, rest and roll thinly.|Cook tomato, peanuts and spices in oil, add the dal and enough water for a loose simmer.|Cut the dough into diamonds, add one at a time and simmer, stirring gently, until the dough is fully cooked.",
  posto:
    "Soak poppy seeds for 30 minutes, then grind with a little water.|Warm oil with cumin and chilli. Add cubed potato and cook briefly.|Add poppy paste and water, cover and simmer until the potato is tender and coated.",
  kofta:
    "Boil and mash potato. Combine with crumbled paneer and flour, then shape small balls.|Shallow-fry the kofta using part of the measured oil. Cook onion, tomato and soaked cashews with the rest, then blend.|Simmer the sauce with cream and add the kofta just before serving.",
  soycurry:
    "Soak textured soy in hot water until soft, then drain and squeeze lightly.|Cook onion, tomato and spices in the measured oil.|Add soy, yogurt and a little water, then simmer until the soy is thoroughly heated and absorbs the sauce.",
  friedrice:
    "Cook the rice separately, cool promptly and keep refrigerated until frying. Dice the vegetables and chicken if listed.|Heat oil and cook chicken through or scramble eggs if listed. Add vegetables and stir-fry until tender.|Add the rice and pepper, stir-fry until piping hot throughout and serve immediately.",
  pulao:
    "Rinse and soak rice for 15 minutes. Chop the vegetables.|Warm oil, toast cumin and cinnamon, then soften the onion and add vegetables.|Add rice and enough water to cook it, cover and simmer until absorbed. Rest, then fluff.",
  chai: "Simmer brewed tea with milk, ginger, cardamom and sugar, then strain.|Slice the listed bread and toast on low heat or bake until dry and crisp.|Serve the tea with the homemade rusk-style toast.",
  roastchana:
    "Soak chickpeas overnight, drain and boil in fresh water until tender.|Dry thoroughly, toss with the measured oil and spices.|Roast, turning regularly, until crisp. Cool before serving.",
  roast:
    "Toss the makhana or peanuts with the measured fat and spices; mix besan with a little water into a coating if listed.|Roast in a pan over low heat or in the oven, stirring regularly.|Cook until crisp and allow to cool before dividing into servings.",
  bhel: "Puff or dry-roast the rice using a hot heavy pan until crisp; cool. Boil and dice the potato.|Soften dates in hot water, blend with lemon and cumin if listed to make a chutney. Toast peanuts in the measured oil.|Toss the crisp rice, peanuts, vegetables and chutney together just before serving. This is a homemade rice-crisp version.",
  sevpuri:
    "Knead white flour with water and a little oil, roll thin discs and pan-fry until crisp. Boil the potato.|Make a stiff besan dough with water and press fine strands into the remaining oil; fry until crisp. Blend softened dates with water and cumin.|Top the discs with potato, chopped vegetables, date chutney and the sev. Assemble just before serving.",
  panipuri:
    "Knead semolina and flour with warm water, rest, roll thin and cut small rounds. Fry in the measured oil until puffed.|Soak and boil chickpeas until tender; boil and dice potato.|Mix lemon, cumin and chilli if listed into cold drinking water. Fill the cooled shells with potato and chickpeas and add the seasoned water just before eating.",
  samosa:
    "Boil and mash potato. Cook peas and cumin with a little oil and mix into the potato.|Knead flour with some oil and water, rest, then roll, fill and seal small samosas.|Cook slowly in the remaining measured oil, turning until crisp and cooked through. Serve with a simple lemon-cumin dressing made from the listed ingredients.",
  cutlet:
    "Boil potato, carrot and peas, drain well and mash roughly.|Mix with bread crumbs and spices, then shape patties.|Pan-fry in the measured oil until crisp on both sides and hot throughout.",
  kachori:
    "Soak moong for 2 hours, drain, grind coarsely and cook with spices and a little oil until dry.|Knead flour with water and some oil, rest, then fill and seal small discs with the cooked dal.|Fry slowly in the remaining measured oil, turning until crisp and cooked through.",
  pakora:
    "Slice the vegetables thinly and mix with besan, spices and just enough water to make a coating.|Heat the measured oil in a shallow pan.|Fry small portions, turning until crisp and the vegetables are cooked. Drain and serve.",
  salad:
    "Wash and chop the fruit or vegetables. Boil corn if listed, then cool.|Toss the prepared ingredients with lemon juice and the listed cumin.|Divide into servings and serve immediately.",
  roll: "Marinate paneer or chicken in yogurt and chilli. Cook with the listed vegetables and part of the oil until fully cooked.|Knead flour with water, roll thin flatbreads and cook using the remaining oil.|Divide the filling between the flatbreads, roll tightly and serve.",
  papad:
    "Soak urad, drain and grind very finely. Mix with cumin and a little water into a stiff paste.|Spread very thin discs and dry completely, then roast or brush with the measured oil and cook until crisp.|Top with finely chopped onion, tomato and lemon immediately before serving. This is a homemade urad-papad formulation.",
  dahivada:
    "Soak urad for 4 hours, drain and grind to a fluffy batter. Shallow-fry small vada in the measured oil until cooked.|Dip briefly in warm water, squeeze gently and let cool.|Whisk yogurt with sugar, pour over the vada and finish with cumin and chilli. Oil listed is the amount used for this shallow-fried formulation.",
  chilliidli:
    "Soak, grind and ferment rice and urad batter, then steam idli until set and cool. Alternatively use the same weighed batch prepared the previous day and refrigerated.|Cube the idli. Cook chopped onion, pepper and tomato in oil with chilli.|Add the idli and stir-fry until hot throughout, coating gently in the vegetables.",
  chanachaat:
    "Soak chickpeas overnight, then boil in fresh water until fully tender.|Drain, cool and toss with the chopped vegetables.|Add lemon and cumin, mix and serve.",
  murukku:
    "Grind dry rice and urad to fine flour. Mix with butter, cumin and water into a smooth dough.|Use a murukku press to form small spirals.|Fry in batches using the measured oil, turning until crisp. Cool completely before storing.",
  khandvi:
    "Whisk besan, yogurt, turmeric and water into a smooth thin mixture.|Cook over medium-low heat, stirring continuously, until thick enough that a thin smear sets and can be rolled.|Spread thinly on a clean tray, cool, cut strips and roll. Temper mustard in oil and pour over, finishing with coconut.",
  drink:
    "Combine the listed yogurt, milk, fruit or coconut water as appropriate. Add cold drinking water only if needed for the desired consistency.|Blend or whisk with the listed sugar and spices. For coconut water with malai, simply stir in the tender coconut pieces.|Divide into servings and serve chilled.",
  chips:
    "Peel and thinly slice the banana. Pat dry and toss with turmeric.|Brush with the measured oil and spread in a single layer.|Bake or air-fry, turning as needed, until crisp. Cool before serving.",
  boondi:
    "Whisk besan with water to make a flowing batter.|Drop tiny droplets through a perforated spoon into the measured oil and fry in small batches until crisp.|Cool, briefly soak and drain if desired, then fold into yogurt with cumin and chilli.",
  raita:
    "Wash and grate or dice the cucumber.|Whisk yogurt until smooth and fold in cucumber and cumin.|Chill until serving. Add a little water if a thinner consistency is preferred.",
  jamun:
    "Reduce the milk gently until thick milk solids remain. Cool, mix with flour and knead gently; add water only as needed to shape small smooth balls.|Cook balls in the measured ghee in a small pan, turning gently until golden and cooked inside.|Dissolve sugar in water with cardamom and simmer briefly. Soak the warm balls in the syrup and divide the entire batch, including syrup, between servings.",
  rasgulla:
    "Use soft, unsalted paneer. Knead until smooth, mix in lemon and shape small balls.|Dissolve sugar in water and bring to a steady simmer in a wide covered pan.|Add the balls and simmer until spongy and cooked, then cool in the syrup. Nutrition includes all listed syrup, so serve it with the batch.",
  halwa:
    "Grate carrot and simmer in milk, stirring regularly, until the carrot is soft and most moisture evaporates.|Add sugar and ghee and cook until thick.|Fold in cashews and cardamom, then divide into servings.",
  kheer:
    "Rinse rice and simmer gently in milk, stirring often to prevent sticking.|Cook until rice is soft and milk thickens, then add sugar and cardamom.|Stir in chopped almonds and serve warm or chilled.",
  ladoo:
    "Roast besan slowly in ghee, stirring constantly, until fragrant and evenly golden.|Cool until warm, then mix in sugar and cardamom.|Shape into equal balls and let set before serving.",
  shrikhand:
    "Use thick yogurt and whisk until smooth; this formulation keeps the whole listed yogurt rather than discarding whey.|Fold in sugar and cardamom until dissolved.|Chill, then divide into servings and top with chopped almonds.",
  mishtidoi:
    "Warm the milk and reduce it slightly. Caramelise part of the sugar gently with a little water, then dissolve into the milk with the remaining sugar.|Cool until lukewarm and stir in the yogurt starter.|Leave covered in a warm place until set, then refrigerate before serving.",
  jalebi:
    "Mix flour, yogurt and water into a thick piping batter and leave until lightly fermented.|Reduce milk with cardamom until thick for rabri. Dissolve sugar in water and simmer briefly for syrup.|Pipe small spirals into the measured oil, turn until crisp, dip in syrup and serve with rabri. Nutrition includes all syrup and oil listed for the batch.",
  grillsalad:
    "Marinate the paneer or chicken in yogurt, spices, oil and half the lemon.|Grill or roast until fully cooked, then slice.|Arrange over the washed vegetables and spinach and finish with the remaining lemon. Use all measured marinade in the cooked batch.",
  cheelaroll:
    "Whisk besan with water, cumin and chopped onion into a flowing batter.|Crumble paneer and warm with chopped tomato. Cook thin cheela in the measured oil, turning until set.|Divide the paneer filling between cheela, roll and serve.",
  cauliflowerrice:
    "Grate cauliflower into rice-sized pieces and finely chop the other vegetables.|Warm oil with cumin, then soften onion, carrot, beans and peas.|Add cauliflower and stir-fry briefly until tender but still separate. Serve hot.",
};
export function recipeInstructions(method: string) {
  const text = METHODS[method];
  if (!text) throw new Error(`Missing original recipe instructions: ${method}`);
  return text.split("|");
}
