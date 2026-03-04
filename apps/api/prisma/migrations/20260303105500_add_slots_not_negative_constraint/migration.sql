-- Add CHECK constraint to prevent availableSlots from going negative
ALTER TABLE courses ADD CONSTRAINT slots_not_negative CHECK ("availableSlots" >= 0);
