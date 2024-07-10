-- Insert into Employer

-- Insert into Project

-- Insert into Material

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
                                                                          ('2024-07-01', 'MILESTONE', NULL, 1, NULL),
                                                                          ('2024-08-15', 'ADVANCE',  NULL, 5, NULL),
                                                                          ('2024-09-01', 'INSTALLMENT',  NULL, 8, NULL),
                                                                          ('2024-10-15', 'MILESTONE',  NULL,  NULL,5),
                                                                          ('2024-11-01', 'ADVANCE', NULL, NULL, 1),
                                                                          ('2024-12-15', 'INSTALLMENT',  NULL, NULL, 3);

-- Insert into User

-- Insert into Salary


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

