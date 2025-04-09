/*
  # Add admin role and model management tables

  1. New Tables
    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `role` (text)
    - `models`
      - `id` (uuid, primary key)
      - `name` (text)
      - `unique_id` (text, unique)
      - `file_path` (text)
      - `size_bytes` (bigint)
      - `upload_date` (timestamptz)
      - `readme_content` (text)
      - `uploader_id` (uuid, references profiles)
    
  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add policies for user access
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create models table
CREATE TABLE IF NOT EXISTS models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  unique_id text UNIQUE NOT NULL,
  file_path text NOT NULL,
  size_bytes bigint NOT NULL,
  upload_date timestamptz DEFAULT now(),
  readme_content text,
  uploader_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Policies for user_roles
CREATE POLICY "Users can read own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for models
CREATE POLICY "Anyone can read models"
  ON models
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert models"
  ON models
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update models"
  ON models
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = $1
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;