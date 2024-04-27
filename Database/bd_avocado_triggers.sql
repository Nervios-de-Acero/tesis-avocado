/*------ TRIGGERS ------*/

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