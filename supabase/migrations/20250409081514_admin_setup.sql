-- Ensure the root admin exists and has admin role
INSERT INTO auth.users (email, role)
VALUES ('b123153@iiit-bh.ac.in', 'authenticated')
ON CONFLICT (email) DO NOTHING;

-- Ensure root admin role
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'b123153@iiit-bh.ac.in'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
