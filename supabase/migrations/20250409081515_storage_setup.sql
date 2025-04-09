-- Create storage policies for models bucket
CREATE POLICY "Authenticated users can view models"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'models');

CREATE POLICY "Only admins can upload models"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'models' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Only admins can update models"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'models' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
