-- Insert into User
INSERT INTO user (id, username, password, role) VALUES
                                                    (1, 'admin', 'hashed_password_1', 'ADMIN'),
                                                    (2, 'mohammed_a', 'hashed_password_2', 'TECHNICIEN'),
                                                    (3, 'fatima_b', 'hashed_password_3', 'TECHNICIEN'),
                                                    (4, 'youssef_e', 'hashed_password_4', 'TECHNICIEN'),
                                                    (5, 'amina_t', 'hashed_password_5', 'TECHNICIEN');

-- Insert into Employer
INSERT INTO employer (name, phone, cin, email, adress, hire_date, birth_date, url, user_id) VALUES
                                                                                                ('Mohammed Alaoui', '0661234567', 'BE123456', 'mohammed@example.com', 'Casablanca', '2023-01-15', '1990-05-20', NULL, 2),
                                                                                                ('Fatima Bennis', '0662345678', 'BK234567', 'fatima@example.com', 'Rabat', '2023-02-01', '1988-07-10', NULL, 3),
                                                                                                ('Youssef El Amrani', '0663456789', 'BJ345678', 'youssef@example.com', 'Marrakech', '2023-03-10', '1992-09-15', NULL, 4),
                                                                                                ('Amina Tazi', '0664567890', 'BH456789', 'amina@example.com', 'Tangier', '2023-04-05', '1995-11-20', NULL, 5),
                                                                                                ('Karim Idrissi', '0665678901', 'BG567890', 'karim@example.com', 'Fez', '2023-05-20', '1991-02-25', NULL, NULL);

-- The rest of your SQL script remains the same
-- ...
-- Insert into Project
INSERT INTO project (name, description, budget, paid, done, start_date, end_date, url) VALUES
                                                                                           ('Marrakech Resort', 'Luxury resort construction', 10000000.00, false, false, '2024-03-01', '2025-12-31', NULL),
                                                                                           ('Casablanca Office Tower', 'Modern office building in city center', 15000000.00, false, false, '2024-04-15', '2026-06-30', NULL);

-- Insert into Material
INSERT INTO material (name, owned, reference) VALUES
                                                  ('Cement Mixer', true, 'CM001'),
                                                  ('Excavator', true, 'EX002'),
                                                  ('Crane', false, 'CR003'),
                                                  ('Dump Truck', true, 'DT004'),
                                                  ('Concrete Pump', false, 'CP005');

-- Insert into Task
INSERT INTO task (tasktype, done, title, description, starting_date, ending_date, project_id) VALUES
                                                                                                  ('BUILDING', false, 'Foundation Work', 'Lay foundation for main building', '2024-03-15', '2024-04-30', 1),
                                                                                                  ('BUILDING', true, 'Architectural Plans', 'Finalize building design', '2024-04-01', '2024-05-15', 2),
                                                                                                  ('FOUNDATION_WORK', false, 'Site Survey', 'Conduct geological survey', '2024-05-10', '2024-06-10', 1),
                                                                                                  ('FRAMING', false, 'Material Procurement', 'Order and deliver construction materials', '2024-06-20', '2024-08-31', 2),
                                                                                                  ('PAINTING', false, 'Facade Painting', 'Paint exterior walls', '2024-07-15', '2024-09-30', 1);

-- Insert into Payment
INSERT INTO payment (time, type, project_id, material_id, employer_id) VALUES
                                                                           ('2024-03-01', 'EMPLOYER', 1, NULL, NULL),
                                                                           ('2024-04-15', 'EMPLOYER', 2, NULL, NULL),
                                                                           ('2024-05-01', 'PROJECT', NULL, 1, NULL),
                                                                           ('2024-06-15', 'PROJECT', NULL, 2, NULL),
                                                                           ('2024-07-01', 'MATERIAL', NULL, NULL, 1);
-- Insert into User
INSERT INTO user (username, password, role) VALUES
                                                ('admin', 'hashed_password_1', 'ADMIN'),
                                                ('mohammed_a', 'hashed_password_2', 'TECHNICIEN'),
                                                ('fatima_b', 'hashed_password_3', 'TECHNICIEN');

-- Insert into Salary
INSERT INTO salary (amount, frequency, paid, starting_date, employers_id, material_id) VALUES
                                                                                           (8000.00, 'MONTHLY', true, '2023-01-15', 1, NULL),
                                                                                           (7500.00, 'MONTHLY', true, '2023-02-01', 2, NULL),
                                                                                           (12000.00, 'MONTHLY', true, '2023-03-10', 3, NULL),
                                                                                           (7000.00, 'MONTHLY', true, '2023-04-05', 4, NULL),
                                                                                           (7200.00, 'MONTHLY', true, '2023-05-20', 5, NULL);

-- Insert into Project_Employer (relation table)
INSERT INTO project_employer (employer_id, project_id) VALUES
                                                           (1, 1),
                                                           (2, 2),
                                                           (3, 1),
                                                           (4, 2),
                                                           (5, 1);

-- Insert into Employer_Material (relation table)
INSERT INTO employer_material (employer_id, material_id) VALUES
                                                             (1, 1),
                                                             (2, 2),
                                                             (3, 3),
                                                             (4, 4),
                                                             (5, 5);

-- Insert into Project_Material (relation table)
INSERT INTO project_material (project_id, material_id) VALUES
                                                           (1, 1),
                                                           (2, 2),
                                                           (1, 3),
                                                           (2, 4),
                                                           (1, 5);

-- Insert into Task_Material (relation table)
INSERT INTO material_task (task_id, material_id) VALUES
                                                     (1, 1),
                                                     (2, 2),
                                                     (3, 3),
                                                     (4, 4),
                                                     (5, 5);

-- Insert into Task_Employer (relation table)
INSERT INTO task_employer (task_id, employer_id) VALUES
                                            (1, 1),
                                            (2, 2),
                                            (3, 3),
                                            (4, 4),
                                            (5, 5);
