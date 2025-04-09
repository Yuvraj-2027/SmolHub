/*
  Add model cards table and policies
*/

-- Create model_cards table
CREATE TABLE IF NOT EXISTS model_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid REFERENCES models(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE model_cards ENABLE ROW LEVEL SECURITY;

-- Policies for model_cards
CREATE POLICY "Anyone can read model cards"
  ON model_cards
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create model cards"
  ON model_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own model cards"
  ON model_cards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);
