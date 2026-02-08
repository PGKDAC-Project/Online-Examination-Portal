-- Add target_batch column to announcements table
ALTER TABLE announcements 
ADD COLUMN target_batch VARCHAR(100) NULL;
