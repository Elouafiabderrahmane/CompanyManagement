-- Insert into role
INSERT INTO role (id, role) VALUES
                                (1, 'ADMIN'),
                                (2, 'TECHNICIEN');

-- Insert into user
-- Insert into user
INSERT INTO user (id, email, enabled, password, username) VALUES
                                                              (1, 'admin@example.com', 1, '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'admin'),
                                                              (2, 'mohammed@example.com', 1, '$2a$10$wnmLv7c49mf8OtHBjSAqAe6IjMUX7Bx/qAx1zUWmVYZPIYvyWDMM2', 'mohammed_a'),
                                                              (3, 'fatima@example.com', 1, '$2a$10$yYQaJrHzjOgD5wWCyelp0e6oS.mZInbvxxi1TI8FA6NEUSwHXvhiO', 'fatima_b'),
                                                              (4, 'youssef@example.com', 1, '$2a$10$Fh50uBrIWqVkt3vy5oFVF.cpnYzEYlaVMUwpP15gNyYZ4cvyMBJcm', 'youssef_e'),
                                                              (5, 'amina@example.com', 1, '$2a$10$6nhSNO/AyGA2UZ7F1iQ4pehQTr52quX.zSS4DTHGi6A7e9xhsZVNS', 'amina_t');
-- Insert into user_role
INSERT INTO user_role (role_id, user_id) VALUES
                                             (1, 1),
                                             (2, 2),
                                             (2, 3),
                                             (2, 4),
                                             (2, 5);

-- Insert into employer
INSERT INTO employer (id, adress, birth_date, cin, email, hire_date, name, phone, url, user_id) VALUES
                                                                                                    (1, 'Casablanca', '1990-05-20', 'BE123456', 'mohammed@example.com', '2023-01-15', 'Mohammed Alaoui', '0661234567', NULL, 2),
                                                                                                    (2, 'Rabat', '1988-07-10', 'BK234567', 'fatima@example.com', '2023-02-01', 'Fatima Bennis', '0662345678', NULL, 3),
                                                                                                    (3, 'Marrakech', '1992-09-15', 'BJ345678', 'youssef@example.com', '2023-03-10', 'Youssef El Amrani', '0663456789', NULL, 4),
                                                                                                    (4, 'Tangier', '1995-11-20', 'BH456789', 'amina@example.com', '2023-04-05', 'Amina Tazi', '0664567890', NULL, 5);

-- Insert into material
INSERT INTO material (id, name, owned, reference) VALUES
                                                      (1, 'Cement Mixer', 1, 'CM001'),
                                                      (2, 'Excavator', 1, 'EX002'),
                                                      (3, 'Crane', 0, 'CR003'),
                                                      (4, 'Dump Truck', 1, 'DT004'),
                                                      (5, 'Concrete Pump', 0, 'CP005');

-- Insert into project
INSERT INTO project (id, budget, description, done, end_date, name, paid, start_date, url) VALUES
                                                                                               (1, 10000000.00, 'Luxury resort construction', 0, '2025-12-31', 'Marrakech Resort', 0, '2024-03-01', NULL),
                                                                                               (2, 15000000.00, 'Modern office building in city center', 0, '2026-06-30', 'Casablanca Office Tower', 0, '2024-04-15', NULL);

-- Insert into task
INSERT INTO task (id, description, done, ending_date, starting_date, tasktype, title, project_id) VALUES
                                                                                                      (1, 'Lay foundation for main building', 0, '2024-04-30', '2024-03-15', 'BUILDING', 'Foundation Work', 1),
                                                                                                      (2, 'Finalize building design', 1, '2024-05-15', '2024-04-01', 'BUILDING', 'Architectural Plans', 2),
                                                                                                      (3, 'Conduct geological survey', 0, '2024-06-10', '2024-05-10', 'BUILDING', 'Site Survey', 1),
                                                                                                      (4, 'Order and deliver construction materials', 0, '2024-08-31', '2024-06-20', 'BUILDING', 'Material Procurement', 2),
                                                                                                      (5, 'Paint exterior walls', 0, '2024-09-30', '2024-07-15', 'PAINTING', 'Facade Painting', 1);

-- Insert into payment
INSERT INTO payment (id, amount, time, type, employer_id, material_id, project_id) VALUES
                                                                                       (1, 50000.00, '2024-03-01', 'PROJECT', NULL, NULL, 1),
                                                                                       (2, 75000.00, '2024-04-15', 'PROJECT', NULL, NULL, 2),
                                                                                       (3, 10000.00, '2024-05-01', 'MATERIAL', NULL, 1, NULL),
                                                                                       (4, 15000.00, '2024-06-15', 'MATERIAL', NULL, 2, NULL),
                                                                                       (5, 8000.00, '2024-07-01', 'EMPLOYER', 1, NULL, NULL);

-- Insert into salary
INSERT INTO salary (id, amount, ending_date, frequency, paid, starting_date, employers_id, material_id) VALUES
                                                                                                            (1, 8000.00, NULL, 'MONTHLY', 1, '2023-01-15', 1, NULL),
                                                                                                            (2, 7500.00, NULL, 'MONTHLY', 1, '2023-02-01', 2, NULL),
                                                                                                            (3, 12000.00, NULL, 'MONTHLY', 1, '2023-03-10', 3, NULL),
                                                                                                            (4, 7000.00, NULL, 'MONTHLY', 1, '2023-04-05', 4, NULL);

-- Insert into projet_employer
INSERT INTO projet_employer (project_id, employer_id) VALUES
                                                          (1, 1),
                                                          (2, 2),
                                                          (1, 3),
                                                          (2, 4);

-- Insert into employer_material
INSERT INTO employer_material (employer_id, material_id) VALUES
                                                             (1, 1),
                                                             (2, 2),
                                                             (3, 3),
                                                             (4, 4);

-- Insert into projet_material
INSERT INTO projet_material (project_id, material_id) VALUES
                                                          (1, 1),
                                                          (2, 2),
                                                          (1, 3),
                                                          (2, 4),
                                                          (1, 5);

-- Insert into material_task
INSERT INTO material_task (material_id, task_id) VALUES
                                                     (1, 1),
                                                     (2, 2),
                                                     (3, 3),
                                                     (4, 4),
                                                     (5, 5);

-- Insert into task_employer
INSERT INTO task_employer (task_id, employer_id) VALUES
                                                     (1, 1),
                                                     (2, 2),
                                                     (3, 3),
                                                     (4, 4);
