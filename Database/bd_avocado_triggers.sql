/*------ TRIGGERS ------*/

DELIMITER //
CREATE TRIGGER onUserCreate  BEFORE INSERT ON usuarios
FOR EACH ROW
SET NEW.imagen = 'https://res.cloudinary.com/dsinjhipn/image/upload/v1717266017/paltita_de_perfil_wsidka.png';
//

DELIMITER //
CREATE TRIGGER onUserDelete BEFORE DELETE ON usuarios
FOR EACH ROW 
DELETE FROM recetas WHERE creadoPor = OLD.idUsuario
//

DELIMITER //
CREATE TRIGGER onRecipeDeleteCategories BEFORE DELETE ON recetas
FOR EACH ROW
DELETE FROM recetas_categorias WHERE idReceta = OLD.idReceta;
//

DELIMITER //
CREATE TRIGGER onRecipeDeleteSteps BEFORE DELETE ON recetas
FOR EACH ROW
DELETE FROM pasos WHERE idReceta = OLD.idReceta;
//

DELIMITER //
CREATE TRIGGER onRecipeDeleteIngredientes BEFORE DELETE ON recetas
FOR EACH ROW
DELETE FROM ingredientes WHERE idReceta = OLD.idReceta;
//