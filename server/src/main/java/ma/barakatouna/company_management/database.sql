-- Insert into Employer
INSERT INTO employer (name, phone, cin, email, adress, hire_date, birth_date, url) VALUES
                                                                                       ('Mohammed Alaoui', '0661234567', 'BE123456', 'mohammed@example.com', 'Casablanca', '2023-01-15', '1990-05-20', NULL),
                                                                                       ('Fatima Bennis', '0662345678', 'BK234567', 'fatima@example.com', 'Rabat', '2023-02-01', '1988-07-10', NULL),
                                                                                       ('Youssef El Amrani', '0663456789', 'BJ345678', 'youssef@example.com', 'Marrakech', '2023-03-10', '1992-09-15', NULL),
                                                                                       ('Amina Tazi', '0664567890', 'BH456789', 'amina@example.com', 'Tangier', '2023-04-05', '1995-11-20', NULL),
                                                                                       ('Karim Idrissi', '0665678901', 'BG567890', 'karim@example.com', 'Fez', '2023-05-20', '1991-02-25', NULL),
                                                                                       ('Laila Bouazzaoui', '0666789012', 'BF678901', 'laila@example.com', 'Agadir', '2023-06-15', '1993-04-30', NULL),
                                                                                       ('Hassan El Fassi', '0667890123', 'BE789012', 'hassan@example.com', 'Meknes', '2023-07-01', '1989-08-05', NULL),
                                                                                       ('Nadia Chraibi', '0668901234', 'BD890123', 'nadia@example.com', 'Oujda', '2023-08-10', '1994-10-12', NULL),
                                                                                       ('Omar Benjelloun', '0669012345', 'BC901234', 'omar@example.com', 'Tetouan', '2023-09-05', '1987-12-18', NULL),
                                                                                       ('Samira El Ouazzani', '0670123456', 'BB012345', 'samira@example.com', 'El Jadida', '2023-10-01', '1996-03-22', NULL);

-- Insert into Project
INSERT INTO project (name, description, budget, paid, done, start_date, end_date, url) VALUES
                                                                                           ('Marrakech Resort', 'Luxury resort construction', 10000000.00, false, false, '2024-03-01', '2025-12-31', NULL),
                                                                                           ('Casablanca Office Tower', 'Modern office building in city center', 15000000.00, false, false, '2024-04-15', '2026-06-30', NULL),
                                                                                           ('Rabat Smart City', 'Technological infrastructure upgrade', 20000000.00, false, false, '2024-05-01', '2027-04-30', NULL),
                                                                                           ('Tangier Port Expansion', 'Expansion of shipping facilities', 25000000.00, false, false, '2024-06-15', '2027-12-31', NULL),
                                                                                           ('Agadir Solar Farm', 'Large-scale solar energy project', 18000000.00, false, false, '2024-07-01', '2026-09-30', NULL),
                                                                                           ('Fez Medina Restoration', 'Historical site preservation', 5000000.00, false, false, '2024-08-15', '2025-08-14', NULL),
                                                                                           ('Oujda Industrial Park', 'New industrial zone development', 12000000.00, false, false, '2024-09-01', '2026-02-28', NULL),
                                                                                           ('Essaouira Wind Farm', 'Coastal wind energy project', 8000000.00, false, false, '2024-10-15', '2025-10-14', NULL),
                                                                                           ('Ifrane Eco-Resort', 'Sustainable mountain tourism complex', 7000000.00, false, false, '2024-11-01', '2026-04-30', NULL),
                                                                                           ('Dakhla Desalination Plant', 'Water treatment facility', 30000000.00, false, false, '2024-12-15', '2027-06-30', NULL);

-- Insert into Material
INSERT INTO material (name, owned, reference) VALUES
                                                  ('Cement Mixer', true, 'CM001'),
                                                  ('Excavator', true, 'EX002'),
                                                  ('Crane', false, 'CR003'),
                                                  ('Dump Truck', true, 'DT004'),
                                                  ('Concrete Pump', false, 'CP005'),
                                                  ('Scaffolding Set', true, 'SS006'),
                                                  ('Welding Machine', true, 'WM007'),
                                                  ('Generator', true, 'GN008'),
                                                  ('Forklift', false, 'FL009'),
                                                  ('Bulldozer', true, 'BD010');

-- Insert into Task
INSERT INTO task (tasktype, done, title, description, starting_date, ending_date, projet_id) VALUES
                                                                                                 ('PLUMBING', false, 'Foundation Work', 'Lay foundation for main building', '2024-03-15', '2024-04-30', 1),
                                                                                                 ('PLUMBING', true, 'Architectural Plans', 'Finalize building design', '2024-04-01', '2024-05-15', 2),
                                                                                                 ('PLUMBING', false, 'Site Survey', 'Conduct geological survey', '2024-05-10', '2024-06-10', 3),
                                                                                                 ('ELECTRICAL', false, 'Material Procurement', 'Order and deliver construction materials', '2024-06-20', '2024-08-31', 4),
                                                                                                 ('ELECTRICAL', false, 'Solar Panel Setup', 'Install and connect solar panels', '2024-07-15', '2024-09-30', 5),
                                                                                                 ('ELECTRICAL', false, 'Facade Cleaning', 'Clean and restore historical facades', '2024-08-20', '2024-10-31', 6),
                                                                                                 ('FLOORING', false, 'Road Network', 'Construct internal roads for industrial park', '2024-09-10', '2024-12-15', 7),
                                                                                                 ('FLOORING', false, 'Wind Turbine Assembly', 'Assemble and erect wind turbines', '2024-10-20', '2025-02-28', 8),
                                                                                                 ('FLOORING', false, 'Garden Design', 'Design and plant eco-friendly gardens', '2024-11-15', '2025-03-31', 9),
                                                                                                 ('SIDING', false, 'Filtration System', 'Install water filtration system', '2025-01-10', '2025-04-30', 10);

-- Insert into Payment
INSERT INTO payment (time, type, projet_id, material_id, employer_id) VALUES
                                                                          ('2024-03-01', 'ADVANCE', 1, NULL, NULL),
                                                                          ('2024-04-15', 'MILESTONE', 2, NULL, NULL),
                                                                          ('2024-05-01', 'ADVANCE', 3, NULL, NULL),
                                                                          ('2024-06-15', 'INSTALLMENT', 4, NULL, NULL),
                                                                          ('2024-07-01', 'MILESTONE', 5, NULL, NULL),
                                                                          ('2024-08-15', 'ADVANCE', 6, NULL, NULL),
                                                                          ('2024-09-01', 'INSTALLMENT', 7, NULL, NULL),
                                                                          ('2024-10-15', 'MILESTONE', 8, NULL, NULL),
                                                                          ('2024-11-01', 'ADVANCE', 9, NULL, NULL),
                                                                          ('2024-12-15', 'INSTALLMENT', 10, NULL, NULL);

-- Insert into User
INSERT INTO user (username, password, role) VALUES
                                                ('admin', 'hashed_password_1', 'ADMIN'),
                                                ('mohammed_a', 'hashed_password_2', 'TECHNICIEN'),
                                                ('fatima_b', 'hashed_password_3', 'TECHNICIEN'),
                                                ('youssef_e', 'hashed_password_4', 'TECHNICIEN');

-- Insert into Salary
INSERT INTO salary (amount, frequency, paid, starting_date, employers_id) VALUES
                                                                              (8000.00, 'MONTHLY', true, '2023-01-15', 1),
                                                                              (7500.00, 'MONTHLY', true, '2023-02-01', 2),
                                                                              (12000.00, 'MONTHLY', true, '2023-03-10', 3),
                                                                              (7000.00, 'MONTHLY', true, '2023-04-05', 4),
                                                                              (7200.00, 'MONTHLY', true, '2023-05-20', 5),
                                                                              (11500.00, 'MONTHLY', true, '2023-06-15', 6),
                                                                              (7800.00, 'MONTHLY', true, '2023-07-01', 7),
                                                                              (7300.00, 'MONTHLY', true, '2023-08-10', 8),
                                                                              (7500.00, 'MONTHLY', true, '2023-09-05', 9),
                                                                              (6800.00, 'MONTHLY', true, '2023-10-01', 10);

-- Insert into Project_Employer (relation table)
INSERT INTO project_employer (employer_id, project_id) VALUES
                                                           (1, 1),
                                                           (2, 2),
                                                           (3, 3),
                                                           (4, 4),
                                                           (5, 5),
                                                           (6, 6),
                                                           (7, 7),
                                                           (8, 8),
                                                           (9, 9),
                                                           (10, 10);

-- Insert into Employer_Material (relation table)
INSERT INTO employer_material (employer_id, material_id) VALUES
                                                             (1, 1),
                                                             (2, 2),
                                                             (3, 3),
                                                             (4, 4),
                                                             (5, 5),
                                                             (6, 6),
                                                             (7, 7),
                                                             (8, 8),
                                                             (9, 9),
                                                             (10, 10);

-- Insert into Project_Material (relation table)
INSERT INTO project_material (project_id, material_id) VALUES
                                                           (1, 1),
                                                           (2, 2),
                                                           (3, 3),
                                                           (4, 4),
                                                           (5, 5),
                                                           (6, 6),
                                                           (7, 7),
                                                           (8, 8),
                                                           (9, 9),
                                                           (10, 10);

-- Insert into Task_Material (relation table)
INSERT INTO material_task (task_id, material_id) VALUES
                                                     (1, 1),
                                                     (2, 2),
                                                     (3, 3),
                                                     (4, 4),
                                                     (5, 5),
                                                     (6, 6),
                                                     (7, 7),
                                                     (8, 8),
                                                     (9, 9),
                                                     (10, 10);

-- Insert into Task_Employer (relation table)
INSERT INTO task_employer (task_id, employer_id) VALUES
                                                     (1, 1),
                                                     (2, 2),
                                                     (3, 3),
                                                     (4, 4),
                                                     (5, 5),
                                                     (6, 6),
                                                     (7, 7),
                                                     (8, 8),
                                                     (9, 9),
                                                     (10, 10);

