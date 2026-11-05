export type Testimonial = {
  name: string;
  role: string;
  city: string;
  photo: string;
  quote: string;
  clients: number;
  consentDate: string;
};
/** Publish only genuine, consented customer feedback. */
export const TESTIMONIALS: readonly Testimonial[] = [];
