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

-- Registro
DELIMITER //
CREATE PROCEDURE `sp_registro`(IN userEmail VARCHAR(200), IN userFullName VARCHAR(150), IN userName VARCHAR(15), IN pass CHAR(60))
BEGIN
	DECLARE mailBD VARCHAR(200);
	SET mailBD = (SELECT email FROM usuarios WHERE email = userEmail);
	IF mailBD IS NULL 
		THEN 
			INSERT INTO usuarios (nombreCompleto, imagen, usuario, email, contraseña)
			VALUES(userFullName, NULL, userName, userEmail, pass);
			SELECT true AS success, 'Usuario registrado' AS message;
		ELSE SELECT false AS success, 'Ya existe un usuario con este email' AS message;
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


-- Traer toda la info de una receta (vista detallada)
DELIMITER //
CREATE PROCEDURE `sp_getReceta`(IN idRequest INT)
BEGIN
	IF EXISTS(SELECT * FROM recetas WHERE idReceta = idRequest)
		THEN
			WITH categorias AS (
			  SELECT JSON_ARRAYAGG(nombre) AS categorias
			  FROM categorias c
			  INNER JOIN recetas_categorias rc
			  ON c.idCategoria = rc.idCategoria
			  WHERE rc.idReceta = idRequest
			),
			pasos AS (
			  SELECT JSON_ARRAYAGG(JSON_OBJECT('idPaso',p.idPaso ,'titulo', p.titulo, 'descripcion', p.descripcion)) AS pasos
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
			SELECT r.idReceta, r.titulo, u.usuario AS creadoPor, u.email AS emailCreadoPor, r.tiempoCoccion, r.dificultad, CONVERT(r.imagen USING utf8mb4) AS imagen, 
            r.fechaCreacion, r.fechaActualizacion, r.descripcion 
            FROM recetas r
            INNER JOIN usuarios u
            ON r.creadoPor = u.idUsuario
            WHERE idReceta = idRequest
			)
			SELECT * 
            FROM recetas, ingredientes, pasos, categorias;
		ELSE
			SELECT 'No hay registros' AS result;
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


-- Insertar un ingrediente
DELIMITER //
CREATE PROCEDURE `sp_crearIngrediente` (IN idR INT, IN ingredientes JSON)
BEGIN
	DECLARE largo INT;
	DECLARE i INT;
	DECLARE indice VARCHAR(5);
	SELECT JSON_LENGTH(ingredientes) INTO largo;
	SET i = 0;
	WHILE i < largo DO
		SELECT CONCAT('$[', i, ']') INTO indice;
		SET @nombre = JSON_UNQUOTE(JSON_EXTRACT(ingredientes, indice));
        
		INSERT INTO ingredientes (idReceta, nombre)
		VALUES (idR, @nombre);
        
		SET i = i + 1;
	END WHILE;
END
//

DELIMITER //
CREATE PROCEDURE `sp_actualizarIngredientes` (IN idR INT, IN ingredientes JSON)
BEGIN
DELETE FROM ingredientes WHERE idReceta = idR;
CALL sp_crearIngrediente(idR, ingredientes);
UPDATE recetas SET fechaActualizacion = NOW() WHERE idReceta = idR;
END
//

DELIMITER //
CREATE PROCEDURE `sp_crearPaso` (IN idR INT, IN pasos JSON)
BEGIN
DECLARE largo INT;
	DECLARE i INT;
	DECLARE indiceTitulo VARCHAR(25);
    DECLARE indiceDescripcion VARCHAR(25);
	SELECT JSON_LENGTH(pasos) INTO largo;
	SET i = 0;
	WHILE i < largo DO
		SELECT CONCAT('$[', i, '].titulo') INTO indiceTitulo;
        SELECT CONCAT('$[', i, '].descripcion') INTO indiceDescripcion;
        
		SET @titulo = JSON_UNQUOTE(JSON_EXTRACT(pasos, indiceTitulo));
        SET @descripcion = JSON_UNQUOTE(JSON_EXTRACT(pasos, indiceDescripcion));
        
		INSERT INTO pasos (idReceta, titulo, descripcion)
		VALUES (idR, @titulo, @descripcion);
        
		SET i = i + 1;
	END WHILE;
END
//

DELIMITER //
CREATE PROCEDURE `sp_actualizarPasos` (IN idR INT, IN pasos JSON)
BEGIN
IF (SELECT idReceta FROM recetas WHERE idReceta = idR) IS NOT NULL
THEN
DELETE FROM pasos WHERE idReceta = idR;
CALL sp_crearPaso(idR, pasos);
UPDATE recetas SET fechaActualizacion = NOW() WHERE idReceta = idR;
ELSE SELECT 'La receta no existe' AS message;
END IF;
END
//

DELIMITER //
CREATE PROCEDURE `sp_crearCategoria` (IN idR INT, IN categorias JSON)
BEGIN
DECLARE largo INT;
	DECLARE i INT;
	DECLARE indice VARCHAR(5);
	SELECT JSON_UNQUOTE(JSON_LENGTH(categorias)) INTO largo;
	SET i = 0;
	WHILE i < largo DO
		SELECT CONCAT('$[', i, ']') INTO indice;
		SET @categoria = CAST(JSON_EXTRACT(categorias, indice) AS SIGNED);
        
		INSERT INTO recetas_categorias (idReceta, idCategoria)
		VALUES (idR, @categoria);
        
		SET i = i + 1;
	END WHILE;
END
//

DELIMITER //
CREATE PROCEDURE `sp_actualizarCategoria` (IN idR INT, IN categorias JSON)
BEGIN
DELETE FROM recetas_categorias WHERE idReceta = idR;
IF categorias IS NOT NULL
THEN CALL sp_crearCategoria(idR, categorias);
END IF;
UPDATE recetas SET fechaActualizacion = NOW() WHERE idReceta = idR;
END
//

DELIMITER //
CREATE PROCEDURE `sp_crearReceta` (IN tituloR VARCHAR(250) , IN emailCreador VARCHAR(250), IN tiempoCoccionR VARCHAR(20), IN dificultadR VARCHAR(12), 
IN descripcionR TEXT, IN imagenR BLOB, IN ingredientes JSON , IN pasos JSON, IN categorias JSON)
BEGIN
	DECLARE idR INT;
	DECLARE idUser INT;
	SET idUSer = (SELECT idUsuario FROM usuarios WHERE email = emailCreador);
	IF idUser IS NOT NULL
		THEN
			INSERT INTO recetas (titulo, creadoPor, tiempoCoccion, dificultad, imagen, fechaCreacion, fechaActualizacion, descripcion)
			VALUES (tituloR, idUser, tiempoCoccionR, dificultadR, imagenR, NOW(), NOW(), descripcionR);
			SET idR = LAST_INSERT_ID();
			CALL sp_crearIngrediente(idR, ingredientes);
			CALL sp_crearPaso(idR, pasos);
				IF categorias IS NOT NULL
					THEN CALL sp_crearCategoria(idR, categorias);
				END IF;
		SELECT true AS success, 'Receta creada correctamente' AS message; 
		ELSE SELECT false AS success, 'El usuario no existe' AS message;
	END IF;
END
//


DELIMITER //
CREATE PROCEDURE `sp_actualizarDatosReceta`(IN idR INT, IN descripcionR TEXT, IN tiempoCoccionR VARCHAR(20), IN dificultadR VARCHAR(15))
BEGIN 
	UPDATE recetas SET descripcion = descripcionR WHERE idReceta = idR;
		IF tiempoCoccionR IS NOT NULL
			THEN UPDATE recetas SET tiempoCoccion = tiempoCoccionR WHERE idReceta = idR;
		END IF;
		IF dificultadR IS NOT NULL
			THEN UPDATE recetas SET dificultad = dificultadR WHERE idReceta = idR;
		END IF;
	UPDATE recetas SET fechaActualizacion = NOW();
END
//

/********************************* NUEVO SP PARA PASOS, INGREDIENTES O CATEGORÍAS ****************************************/
DELIMITER //
CREATE PROCEDURE sp_crearPasoIngredienteCategoria (
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
	SET @dato = CAST(JSON_EXTRACT(categorias, el) AS SIGNED);
	INSERT INTO recetas_categorias (idReceta, idCategoria)
	VALUES (idR, @dato);

ELSE 
    SIGNAL SQLSTATE '45000'
	SET MESSAGE_TEXT = 'Tipo de elemento inválido.';
END IF;

SET i = i + 1;
END WHILE;
END //