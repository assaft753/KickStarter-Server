exports.primary_image_of_project = 'SELECT image_name FROM Images WHERE project_id = ? and is_primary = 1';
exports.secondary_images_of_project = 'SELECT image_name FROM Images WHERE project_id = ? and is_primary = 0';
exports.video_of_project = 'SELECT video_name FROM Videos WHERE project_id = ?';
exports.add_image_of_project = 'INSERT INTO Images (project_id,image_name,is_primary) VALUES (?,?,?)';
exports.add_video_of_project = 'INSERT INTO Videos (project_id,video_name) VALUES (?,?)';
exports.update_primary_image_of_project = 'UPDATE Images SET image_name = ? WHERE project_id = ? and is_primary = 1';
exports.delete_secondary_image_of_project = 'DELETE FROM Images WHERE project_id = ? and image_name = ? and is_primary = 0';
exports.delete_video_of_project = 'DELETE FROM Videos WHERE project_id = ?';
exports.update_video_of_project = 'UPDATE Videos SET video_name = ? WHERE project_id = ?';