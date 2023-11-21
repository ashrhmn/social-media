-- CREATE GENERATED COLUMN FOR CONVERSATION KEY
ALTER TABLE messages
	ADD COLUMN conversation_key text GENERATED ALWAYS AS (
		CASE WHEN receiver_id IS NULL THEN
			NULL
		WHEN sender_id > receiver_id THEN
		(sender_id::text || '_' || receiver_id::text)
		ELSE
			(receiver_id::text || '_' || sender_id::text)
		END) stored;
