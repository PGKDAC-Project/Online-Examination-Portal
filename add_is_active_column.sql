-- Add is_active column to batches table
ALTER TABLE batches 
ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1;

-- Update existing records to set is_active = true
UPDATE batches SET is_active = 1 WHERE is_active IS NULL;
