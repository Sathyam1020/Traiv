/**
 * ⚠️ PLACEHOLDER COPY — NOT REAL PEOPLE, NOT REAL QUOTES.
 *
 * Every name, city, quote and number below is invented. Traiv has no customers yet.
 *
 * **This file must be replaced with real, attributed quotes before the site is public.**
 * Published testimonials from people who do not exist are a misrepresentation under the
 * Consumer Protection Act's rules on endorsements, and the first coach who searches a
 * name and finds nobody stops believing the rest of the page too.
 *
 * `positioning.md` already describes how the real ones arrive: the first eight coaches
 * get the product free in exchange for a weekly call and permission to publish their
 * numbers. Swap these out as those land, one at a time.
 */
export const TESTIMONIALS_ARE_PLACEHOLDER = true;

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  city: string;
  clients: number;
  initials: string;
};

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote:
      "I was rebuilding the same four spreadsheets every Sunday. Now I write a block once and spend that time with my family. That is the whole review.",
    name: "Rahul Deshmukh",
    role: "Strength coach",
    city: "Pune",
    clients: 34,
    initials: "RD",
  },
  {
    quote:
      "The katori thing sounds small until you have had three clients ask what 85 grams of dal looks like. Mine stopped asking.",
    name: "Meera Iyer",
    role: "Dietitian",
    city: "Chennai",
    clients: 41,
    initials: "MI",
  },
  {
    quote:
      "I moved 28 people off Trainerize in an afternoon. What sold me was the bill not going up when I signed six more the next month.",
    name: "Aarav Sharma",
    role: "Online coach",
    city: "Delhi",
    clients: 52,
    initials: "AS",
  },
  {
    quote:
      "My clients never downloaded the old app. This one opens from the WhatsApp link, so they actually log. Eleven of twelve logged last week.",
    name: "Priya Kulkarni",
    role: "Personal trainer",
    city: "Mumbai",
    clients: 19,
    initials: "PK",
  },
  {
    quote:
      "It told me Kavya had not trained in nine days before she told me she was thinking of stopping. I have never had software do that.",
    name: "Rohan Das",
    role: "Transformation coach",
    city: "Bengaluru",
    clients: 27,
    initials: "RD",
  },
  {
    quote:
      "₹999 for everyone I coach. I used to pay more than that for nutrition as an add-on alone.",
    name: "Sneha Patil",
    role: "Nutrition coach",
    city: "Nashik",
    clients: 23,
    initials: "SP",
  },
];
