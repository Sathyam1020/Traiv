import { Router } from "express";
import { z } from "zod";
import { requireSession } from "../../middleware/session.js";
import {
  becomeEndorser,
  findEndorserByUser,
  listReferrals,
  previewEndorserCode,
} from "./service.js";

export const endorse: Router = Router();

const code = z.string().min(4).max(16);

/**
 * Public, so the signup form can confirm a code before sending an OTP.
 *
 * Returns the endorser's name and nothing else. Enough to answer "is this who you
 * meant", not enough to make guessing codes worth anyone's time.
 */
endorse.get("/code/:code", async (req, res) => {
  const { code: c } = z.object({ code }).parse(req.params);
  res.json(await previewEndorserCode(c));
});

/**
 * Anyone signed in may join. Not gated on being a coach or a client, because an endorser
 * is neither — it is a third thing a person can be, and plenty of them will never train
 * anyone or be trained. Idempotent, so the button is safe to double-tap.
 */
endorse.post("/join", async (req, res) => {
  const { userId } = requireSession(req);
  res.json(await becomeEndorser(userId));
});

/** Your own endorser record, or null if you have not joined. Not an error — a state. */
endorse.get("/me", async (req, res) => {
  const { userId } = requireSession(req);
  res.json({ endorser: await findEndorserByUser(userId) });
});

/** The studios you brought in. Scoped to your own record; never takes an id. */
endorse.get("/referrals", async (req, res) => {
  const { userId } = requireSession(req);
  res.json({ referrals: await listReferrals(userId) });
});
