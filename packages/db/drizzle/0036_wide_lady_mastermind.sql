CREATE TABLE "check_in_review" (
	"check_in_id" text PRIMARY KEY NOT NULL,
	"studio_id" text NOT NULL,
	"reviewer_id" text NOT NULL,
	"reviewed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_asset" (
	"id" text PRIMARY KEY NOT NULL,
	"studio_id" text NOT NULL,
	"client_id" text NOT NULL,
	"owner_id" text NOT NULL,
	"provider" text DEFAULT 'cloudinary' NOT NULL,
	"key" text NOT NULL,
	"resource_type" text NOT NULL,
	"format" text,
	"name" text NOT NULL,
	"bytes" integer,
	"metadata" jsonb,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_attachment" (
	"message_id" text NOT NULL,
	"asset_id" text NOT NULL,
	CONSTRAINT "chat_attachment_message_id_asset_id_pk" PRIMARY KEY("message_id","asset_id")
);
--> statement-breakpoint
CREATE TABLE "chat_reaction" (
	"message_id" text NOT NULL,
	"user_id" text NOT NULL,
	"emoji" text NOT NULL,
	CONSTRAINT "chat_reaction_message_id_user_id_pk" PRIMARY KEY("message_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "chat_read" (
	"client_id" text NOT NULL,
	"user_id" text NOT NULL,
	"channel" text NOT NULL,
	"read_at" timestamp with time zone NOT NULL,
	CONSTRAINT "chat_read_client_id_user_id_channel_pk" PRIMARY KEY("client_id","user_id","channel")
);
--> statement-breakpoint
CREATE TABLE "chat_message" (
	"id" text PRIMARY KEY NOT NULL,
	"studio_id" text NOT NULL,
	"client_id" text NOT NULL,
	"channel" text DEFAULT 'chat' NOT NULL,
	"author" text NOT NULL,
	"sender_id" text,
	"body" text DEFAULT '' NOT NULL,
	"reply_to" text,
	"kind" text DEFAULT 'text' NOT NULL,
	"source_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "check_in_review" ADD CONSTRAINT "check_in_review_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_in_review" ADD CONSTRAINT "check_in_review_reviewer_id_user_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_asset" ADD CONSTRAINT "media_asset_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_asset" ADD CONSTRAINT "media_asset_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_asset" ADD CONSTRAINT "media_asset_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_attachment" ADD CONSTRAINT "chat_attachment_message_id_chat_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."chat_message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_attachment" ADD CONSTRAINT "chat_attachment_asset_id_media_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."media_asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_reaction" ADD CONSTRAINT "chat_reaction_message_id_chat_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."chat_message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_reaction" ADD CONSTRAINT "chat_reaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_read" ADD CONSTRAINT "chat_read_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_read" ADD CONSTRAINT "chat_read_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "media_owner_idx" ON "media_asset" USING btree ("client_id","owner_id");--> statement-breakpoint
CREATE INDEX "chat_history_idx" ON "chat_message" USING btree ("studio_id","client_id","channel","created_at","id");--> statement-breakpoint
CREATE UNIQUE INDEX "chat_activity_once_idx" ON "chat_message" USING btree ("client_id","kind","source_id");--> statement-breakpoint
-- Existing Photo Log conversations remain in place; inbox references preserve their IDs.
INSERT INTO chat_message (id, studio_id, client_id, channel, author, body, kind, source_id, created_at)
SELECT p.id, c.studio_id, p.client_id, 'photo', p.author, COALESCE(p.note, ''),
CASE WHEN p.image_url IS NOT NULL THEN 'photo' ELSE 'text' END, p.id, p.created_at
FROM food_photo_message p JOIN client c ON c.id = p.client_id
ON CONFLICT DO NOTHING;
