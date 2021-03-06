exports.all_projects = 'Select * FROM Projects';
exports.donation_of_project = 'SELECT SUM(amount) as donation FROM Donations WHERE project_id = ?';
exports.donators_of_project = 'SELECT name,amount,user_id FROM Users,Donations WHERE user_id = id and project_id = ?';
exports.login = 'SELECT id,name,is_admin FROM Users WHERE password = ? and name = ?';
exports.check_user_exits='SELECT name FROM Users WHERE name = ?';
exports.add_project = 'INSERT INTO Projects (user_id,project_name,idea,description,desire_amount,days,hours,created_date) VALUES (?,?,?,?,?,?,?,?)';
exports.update_project = 'UPDATE Projects SET idea = ?,description = ?,desire_amount = ?,days = ?,hours = ? WHERE id = ?';
exports.delete_donator_of_project = 'DELETE FROM Donations WHERE user_id = ? and project_id = ?';
exports.donate_to_project = 'INSERT INTO Donations (user_id,project_id,amount) VALUES (?,?,?)';
exports.delete_project = 'DELETE FROM Projects WHERE id = ?';
exports.check_owner_of_project = 'SELECT COUNT(id) as owner FROM Projects WHERE id = ? and user_id = ?';
exports.check_donator_of_project = 'SELECT COUNT(project_id) as donated FROM Donations WHERE user_id = ? and project_id = ?';
exports.register = 'INSERT INTO Users (name,password,is_admin) VALUES (?,?,0)';