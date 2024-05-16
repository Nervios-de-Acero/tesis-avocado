/*------ PROCEDIMIENTOS ALMACENADOS ------*/

-- Iniciar sesión
DELIMITER //
CREATE PROCEDURE `sp_iniciarSesion`(IN userEmail VARCHAR(200))
BEGIN
	DECLARE mailBD VARCHAR(200);
	SET mailBD = (SELECT email FROM usuarios WHERE email = userEmail);
		IF mailBD IS NOT NULL
			THEN SELECT true AS success, (SELECT contraseña FROM usuarios WHERE email = mailBD) AS result;
		ELSE SELECT false AS success, '' AS result;
	END IF;
END
//

DELIMITER //
CREATE PROCEDURE `sp_registro`(
IN userEmail VARCHAR(200), 
IN userFullName VARCHAR(150), 
IN userName VARCHAR(15), 
IN pass CHAR(60), 
IN adminFlag BIT)
BEGIN
	DECLARE mailBD VARCHAR(200);
	
    IF userEmail IS NULL 
	THEN 
		SIGNAL SQLSTATE '45007'
		SET MESSAGE_TEXT = 'Error: Email obligatorio';
	END IF;
    
    IF userFullName IS NULL OR userName IS NULL 
	THEN 
		SIGNAL SQLSTATE '45007'
		SET MESSAGE_TEXT = 'Error: Nombre completo y nombre de usuario obligatorios.';
	END IF;
    
	IF pass IS NULL
	THEN 
		SIGNAL SQLSTATE '45007'
		SET MESSAGE_TEXT = 'Error: Password obligatorio.';
	END IF;
    
    IF adminFlag IS NULL 
	THEN 
		SIGNAL SQLSTATE '45007'
		SET MESSAGE_TEXT = 'Error: El parámetro para el tipo de usuario no debe estar vacío.';
	ELSEIF adminFlag NOT IN (0, 1) 
    THEN
		SIGNAL SQLSTATE '45007'
		SET MESSAGE_TEXT = 'Error: El parámetro para el tipo de usuario debe ser 0 o 1.';
	END IF;
    
    SET mailBD = (SELECT email FROM usuarios WHERE email = userEmail);
	IF mailBD IS NOT NULL 
		THEN 
			SIGNAL SQLSTATE '45007'
			SET MESSAGE_TEXT = 'Error: Ya existe un usuario con ese email.';
		ELSE 
			INSERT INTO usuarios (nombreCompleto, imagen, usuario, email, contraseña, isAdmin)
			VALUES(userFullName, NULL, userName, userEmail, pass, adminFlag);
	END IF;
END
//


-- Actualizar datos de perfil
DELIMITER //
CREATE PROCEDURE `sp_actualizarPerfil` (IN userEmail VARCHAR(200), IN userFullName VARCHAR(150), IN userImg BLOB, IN userName VARCHAR(15))
BEGIN 
		IF userFullName IS NOT NULL
			THEN UPDATE usuarios SET nombreCompleto = userFullName WHERE email = userEmail;
		END IF;
		IF userImg IS NOT NULL
			THEN UPDATE usuarios SET imagen = userImg WHERE email = userEmail;
		END IF;
		IF userName IS NOT NULL
			THEN UPDATE usuarios SET usuario = userName WHERE email = userEmail;
		END IF;
END
//

DELIMITER //
CREATE PROCEDURE "sp_getRecetasFeed"(
IN categoria INT)
BEGIN
IF categoria IS NULL
	THEN
	SELECT idReceta, titulo, descripcion, imagen, fechaCreacion, fechaActualizacion 
	FROM recetas;
ELSE 
SELECT r.idReceta, r.titulo, r.descripcion, r.imagen, r.fechaCreacion, r.fechaActualizacion 
	   FROM recetas r
       INNER JOIN recetas_categorias rc
       ON r.idReceta = rc.idReceta
       WHERE rc.idCategoria = categoria;
END IF;
END
//

-- Traer toda la info de una receta (vista detallada)
DELIMITER //
CREATE PROCEDURE `sp_getReceta`(IN idRequest INT)
BEGIN
	IF EXISTS(SELECT * FROM recetas WHERE idReceta = idRequest)
		THEN
			WITH categorias AS (
			  SELECT JSON_ARRAYAGG(JSON_OBJECT('nombre', c.nombre, 'idCategoria', c.idCategoria)) AS categorias
			  FROM categorias c
			  INNER JOIN recetas_categorias rc
			  ON c.idCategoria = rc.idCategoria
			  WHERE rc.idReceta = idRequest
			),
			pasos AS (
			  SELECT JSON_ARRAYAGG(p.descripcion) AS pasos
			  FROM pasos p
			  INNER JOIN recetas r
			  ON r.idReceta = p.idReceta
			  WHERE r.idReceta = idRequest
			),
			ingredientes AS (
			SELECT JSON_ARRAYAGG(i.nombre) AS ingredientes FROM ingredientes i 
			INNER JOIN recetas r
			ON i.idReceta = r.idReceta
			WHERE r.idReceta = idRequest
			),
			recetas AS (
			SELECT r.idReceta, r.titulo, u.usuario AS creadoPor, u.email AS emailCreadoPor, r.tiempoCoccion, r.dificultad, r.imagen AS imagen, 
            r.fechaCreacion, r.fechaActualizacion, r.descripcion 
            FROM recetas r
            INNER JOIN usuarios u
            ON r.creadoPor = u.idUsuario
            WHERE idReceta = idRequest
			)
			SELECT * 
            FROM recetas, ingredientes, pasos, categorias;
		ELSE
			SIGNAL SQLSTATE '45006'
		    SET MESSAGE_TEXT = 'Error: Receta inexistente';
	END IF;
END
//



DROP PROCEDURE sp_getRecetasUsuario;
-- Traer recetas del usuario
DELIMITER //
CREATE PROCEDURE `sp_getRecetasUsuario` (IN emailUsuario VARCHAR(200))
BEGIN
	DECLARE id INT;
	SET id = (SELECT idUsuario FROM usuarios WHERE email = emailUsuario);
	IF (SELECT COUNT(*) FROM recetas WHERE creadoPor = id) > 0
		THEN
			SELECT idReceta, titulo, CONVERT(imagen USING utf8mb4) AS imagen FROM recetas WHERE creadoPor = id;
	END IF;
END
//



-- Buscar receta
DELIMITER //
CREATE PROCEDURE `sp_buscarReceta` (IN tituloReceta VARCHAR(250))
BEGIN
	DECLARE buscar VARCHAR(300);
    SET buscar = CONCAT("%", tituloReceta, "%");
	CREATE TEMPORARY TABLE IF NOT EXISTS temp AS (SELECT  r.idReceta, r.titulo, u.usuario AS creadoPor, CONVERT(r.imagen USING utf8mb4) AS imagen, r.fechaCreacion, r.fechaActualizacion 
	FROM recetas r 
	INNER JOIN usuarios u 
	ON u.idUsuario = r.creadoPor 
	WHERE r.titulo LIKE buscar);
    IF (SELECT COUNT(*) FROM temp) > 0
		THEN SELECT * FROM temp;
	    ELSE SELECT 'Sin resultados' AS result;
    END IF;
    DROP TABLE temp;
END
//


DELIMITER //
CREATE PROCEDURE "sp_crearReceta"(
IN emailCreador VARCHAR(250), 
IN tituloR VARCHAR(250) , 
IN tiempoCoccionR VARCHAR(20), 
IN dificultadR VARCHAR(12), 
IN descripcionR TEXT, 
IN imagenR TEXT, 
IN ingredientes JSON , 
IN pasos JSON, 
IN categorias JSON)
BEGIN
	DECLARE idR INT;
	DECLARE idUser INT;
	SET idUSer = (SELECT idUsuario FROM usuarios WHERE email = emailCreador);
    
     IF emailCreador IS NULL 
	THEN 
		SIGNAL SQLSTATE '45006'
		SET MESSAGE_TEXT = 'Error: Email obligatorio';
	END IF;
    
    IF idUser IS NULL 
	THEN 
		SIGNAL SQLSTATE '45005'
		SET MESSAGE_TEXT = 'Error: El usuario no existe';
	END IF;
    
	IF idUser IS NOT NULL
		THEN
			INSERT INTO recetas (titulo, creadoPor, tiempoCoccion, dificultad, imagen, fechaCreacion, fechaActualizacion, descripcion)
			VALUES (tituloR, idUser, tiempoCoccionR, dificultadR, imagenR, NOW(), NOW(), descripcionR);
			SET idR = LAST_INSERT_ID();
			CALL sp_crearPasoIngredienteCategoria(idR, ingredientes, 'ingredientes');
			CALL sp_crearPasoIngredienteCategoria(idR, pasos, 'pasos');
				IF categorias IS NOT NULL
					THEN CALL sp_crearPasoIngredienteCategoria(idR, categorias, 'categorias');
				END IF;
	END IF;
END //


DELIMITER //
CREATE PROCEDURE `sp_crearPasoIngredienteCategoria` (
IN idR INT,
IN arr JSON,
IN tipo VARCHAR(25)
)
BEGIN
DECLARE filas INT;
DECLARE i INT;
DECLARE len INT;
DECLARE textEl TEXT;
DECLARE el VARCHAR(25);

SELECT JSON_LENGTH(arr) INTO len;
SET i = 0 ;

SELECT COUNT(idReceta) FROM recetas WHERE idReceta = idR INTO filas;
IF filas = 0 
THEN
    SIGNAL SQLSTATE '45000'
	SET MESSAGE_TEXT = 'idReceta inexistente';
END IF;

WHILE i < len DO
IF tipo = 'ingredientes'
THEN 
	SELECT CONCAT('$[', i, ']') INTO textEl;
	SET @dato =  JSON_UNQUOTE(JSON_EXTRACT(arr, textEl));
	INSERT INTO ingredientes (idReceta, nombre)
	VALUES (idR, @dato);
    
ELSEIF tipo = 'pasos'
THEN 
	SELECT CONCAT('$[', i, ']') INTO el;
	SET @dato =  JSON_UNQUOTE(JSON_EXTRACT(arr, el));
	INSERT INTO pasos (idReceta, descripcion)
	VALUES (idR, @dato);

ELSEIF tipo = 'categorias'
THEN 
	SELECT CONCAT('$[', i, ']') INTO el;
	SET @dato = CAST(JSON_EXTRACT(arr, el) AS SIGNED);
	INSERT INTO recetas_categorias (idReceta, idCategoria)
	VALUES (idR, @dato);

ELSE 
    SIGNAL SQLSTATE '45000'
	SET MESSAGE_TEXT = 'Tipo de elemento inválido.';
END IF;

SET i = i + 1;
END WHILE;
END //


DELIMITER //
CREATE PROCEDURE "sp_actualizarReceta" (
IN idR INT, 
IN tituloR VARCHAR(250),
IN descripcionR TEXT, 
IN tiempoCoccionR VARCHAR(20), 
IN dificultadR VARCHAR(15),
IN pasosR JSON,
IN ingredientesR JSON,
IN categoriasR JSON,
IN imagenR TEXT
)
BEGIN 
	IF idR IS NULL 
	THEN 
		SIGNAL SQLSTATE '45002'
		SET MESSAGE_TEXT = 'Error: El id de la receta es obligatorio';
	END IF;

	IF (SELECT COUNT(idReceta) FROM recetas WHERE idReceta = idR ) = 0 
	THEN 
		SIGNAL SQLSTATE '45003'
		SET MESSAGE_TEXT = 'Error: No se encontraron recetas';
	END IF;
    
    IF NOT JSON_VALID(categoriasR) THEN 
    SIGNAL SQLSTATE '45004'
    SET MESSAGE_TEXT = 'Error: El valor de categoriasR no es un JSON válido';
    END IF;
    
    IF tituloR IS NOT NULL
		THEN UPDATE recetas SET titulo = tituloR WHERE idReceta = idR;
 	END IF;

	IF descripcionR IS NOT NULL
		THEN UPDATE recetas SET descripcion = descripcionR WHERE idReceta = idR;
 	END IF;
     
 	IF tiempoCoccionR IS NOT NULL
 		THEN UPDATE recetas SET tiempoCoccion = tiempoCoccionR WHERE idReceta = idR;
 	END IF;
    
 	IF dificultadR IS NOT NULL
 		THEN UPDATE recetas SET dificultad = dificultadR WHERE idReceta = idR;
 	END IF;
    
	IF imagenR IS NOT NULL
 		THEN UPDATE recetas SET imagen = imagenR WHERE idReceta = idR;
	END IF;
    
	IF categoriasR IS NOT NULL
		THEN 
			DELETE FROM recetas_categorias WHERE idReceta = idR;
			CALL sp_crearPasoIngredienteCategoria(idR, categoriasR, 'categorias');
	END IF;
    
    IF ingredientesR IS NOT NULL
		THEN 
 			DELETE FROM ingredientes WHERE idReceta = idR;
 			CALL sp_crearPasoIngredienteCategoria(idR, ingredientesR, 'ingredientes');
 	END IF;
     
	IF pasosR IS NOT NULL
		THEN 
			DELETE FROM pasos WHERE idReceta = idR;
 			CALL sp_crearPasoIngredienteCategoria(idR, pasosR, 'pasos');
 	END IF;
    
	UPDATE recetas SET fechaActualizacion = NOW();
END
//

DELIMITER //
CREATE PROCEDURE `sp_getProductos`()
BEGIN
SELECT * FROM productos;
END
//

DELIMITER //
CREATE PROCEDURE `sp_crearProducto`(IN nombre VARCHAR(150), IN personas INT, IN recetas INT, IN precio INT)
BEGIN
IF nombre IS NULL OR nombre = ''
THEN
	SIGNAL SQLSTATE '45005'
	SET MESSAGE_TEXT = 'Error: El parámetro "nombre" es obligatorio';
END IF;

IF personas IS NULL
THEN
	SIGNAL SQLSTATE '45005'
	SET MESSAGE_TEXT = 'Error: El parámetro "cantidadPersonas" es obligatorio';
END IF;

IF recetas IS NULL
THEN
	SIGNAL SQLSTATE '45005'
	SET MESSAGE_TEXT = 'Error: El parámetro "cantidadRecetas" es obligatorio';
END IF;

IF personas <= 0 OR recetas <= 0 OR precio <= 0
THEN
	SIGNAL SQLSTATE '45005'
	SET MESSAGE_TEXT = 'Error: La cantidad de personas, recetas o precio deben ser mayores a cero.';
END IF;

INSERT INTO productos (nombre, cantPersonas, cantRecetas, precio)
VALUES (nombre, personas, recetas, precio);
END
//

DELIMITER //
CREATE PROCEDURE `sp_getUsuario`(
IN emailUser VARCHAR(200)
)
BEGIN
IF (SELECT COUNT(*) FROM usuarios WHERE email = emailUser) > 0
THEN
SELECT email, contraseña, nombreCompleto, usuario, imagen,
CASE 
	WHEN isAdmin = 1 
    THEN TRUE
    ELSE FALSE
    END AS "isAdmin"
FROM usuarios
WHERE email = emailUser;
ELSE
SIGNAL SQLSTATE '45005'
SET MESSAGE_TEXT = 'Usuario inexistente';
END IF;
END //