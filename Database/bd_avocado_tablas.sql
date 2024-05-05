USE Avocado;

/*Tabla Usuarios*/

CREATE TABLE usuarios(
idUsuario INT PRIMARY KEY AUTO_INCREMENT,
nombreCompleto VARCHAR(150) NOT NULL,
imagen TEXT,
usuario VARCHAR(15) UNIQUE,
email VARCHAR(200) UNIQUE NOT NULL,
contraseña CHAR(60) NOT NULL,
isAdmin BIT NOT NULL
);

CREATE TABLE recetas(
idReceta INT PRIMARY KEY AUTO_INCREMENT,
titulo VARCHAR(250) NOT NULL,
creadoPor INT NOT NULL,
tiempoCoccion VARCHAR(20),
dificultad VARCHAR(12),
imagen LONGBLOB,
fechaCreacion DATETIME NOT NULL,
fechaActualizacion DATETIME NOT NULL,
descripcion TEXT NOT NULL,
CONSTRAINT fk_creado FOREIGN KEY(creadoPor) REFERENCES usuarios(idUsuario)
);

CREATE TABLE categorias(
idCategoria INT PRIMARY KEY,
nombre VARCHAR(24) NOT NULL
);

CREATE TABLE ingredientes(
idIngrediente INT PRIMARY KEY AUTO_INCREMENT,
idReceta INT NOT NULL,
nombre VARCHAR(50) NOT NULL,
CONSTRAINT fk_receta FOREIGN KEY(idReceta) REFERENCES recetas(idReceta)
);

CREATE TABLE pasos(
idPaso INT PRIMARY KEY AUTO_INCREMENT,
idReceta INT NOT NULL,
descripcion TEXT NOT NULL,
CONSTRAINT fk_paso FOREIGN KEY(idReceta) REFERENCES recetas(idReceta)
);

CREATE TABLE favoritos(
idFavorito INT PRIMARY KEY AUTO_INCREMENT,
idUsuario INT NOT NULL,
idReceta INT NOT NULL,
CONSTRAINT fk_favUsuario FOREIGN KEY(idUsuario) REFERENCES usuarios(idUsuario),
CONSTRAINT fk_favReceta FOREIGN KEY(idReceta) REFERENCES recetas(idReceta)
);

CREATE TABLE recetas_categorias(
idRecetaCategoria INT PRIMARY KEY AUTO_INCREMENT,
idReceta INT NOT NULL,
idCategoria INT NOT NULL,
CONSTRAINT fk_catReceta FOREIGN KEY(idReceta) REFERENCES recetas(idReceta),
CONSTRAINT fk_catCategoria FOREIGN KEY(idCategoria) REFERENCES categorias(idCategoria)
);


-- INSERTAR CATEGORIAS PARA LA TABLA CATEGORIAS
INSERT INTO categorias (idCategoria, nombre) VALUES (1, 'Desayuno'), (2, 'Almuerzo'), (3, 'Cena'), (4, 'Entradas'), (5, 'Aperitivos'), (6, 'Snacks'), 
(7, 'Ensaladas'), (8, 'Platos principales'), (9, 'Guarniciones'), (10, 'Sopas y caldos'), (11, 'Postres'), (12, 'Panadería'), (13, 'Batidos y smoothies'), (14, 'Comida saludable'),
(15, 'Vegetariano/vegano'), (16, 'Comida sin gluten'), (17, 'Tradicional'), (18, 'Internacionales'), (19, 'Dulces'), (20, 'Eventos');

-- DATOS DE PRUEBA 
INSERT INTO usuarios (idUsuario, nombreCompleto, usuario, email, contraseña)
VALUES
  (1, 'Juan Pérez', 'juanito123', 'juan@example.com', '$2b$12$h7k9yWNaKDlyPToZ6.yj8uGVugS.IS0Y5cOpgzu5bz1ad98avhYXK'),
  (2, 'María Rodríguez', 'maria456', 'maria@example.com', '$2b$12$VtRUYrSMYfrNdJASRUXg2.GQXs4aY7AxEbIU18jrLcDU/gg/ScsHS'),
  (3, 'Carlos González', 'carlos789', 'carlos@example.com', '$2b$12$xtmFLQWVwwqlycH/SClXT.R/paShzbIcGd.5SNeCwjX/QkdPJOh2K'),
  (4, 'Luisa Martínez', 'luisa101', 'luisa@example.com', '$2b$12$B7PFLYqxUou8pGslQ73SIuYshDZFkq2I2iPwOiG4casiSxvmTGYWG'),
  (5, 'Ana Sánchez', 'ana2022', 'ana@example.com', '$2b$12$o2qapbTOQffZI0Ci8f.4HOmjoWa2inx95LvldEklQ/qv2GcxA1Ute'),
  (6, 'Pedro López', 'pedrito99', 'pedro@example.com', '$2b$12$qoDHQ1i/cP6CWu/GEZRKoOjeDr5TVdzt6dKzOXUdXAQfudSsSfR3y'),
  (7, 'Laura Ramírez', 'laura888', 'laura@example.com', '$2b$12$5kTLtNOpRZ.KUkEJ5Bca4OHkciAqgPWO8PcMNs5iPmoxBr1dyX77O'),
  (8, 'Jorge Hernández', 'jorge777', 'jorge@example.com', '$2b$12$Y5u92D.VpCJ.yoMgT1w6J.tBxowqRtQKVgUS3SOE4t2aebphHT0sG'),
  (9, 'Marta Torres', 'marta555', 'marta@example.com', '$2b$12$2SaOdbEm08JW5ECO0pvBju/XGIYloxGnBu2sJDg.nauN0V3bjl8ni'),
  (10, 'Santiago Rodríguez', 'santiago333', 'santiago@example.com', '$2b$12$f3YNU7MONLtioATat22Dzepo.2ATlWx6mMoJgR5joMaHhsMWfjf2K');
  
INSERT INTO recetas (idReceta, titulo, creadoPor, tiempoCoccion, dificultad, fechaCreacion, fechaActualizacion, descripcion)
VALUES
 (2, 'Yogur con cereal', 3, '45 minutos', 'Medio', NOW(), NOW(), 'lalalalalalalalalalaa'),
  (1, 'Sanguche de jamón y queso', 1, '30 minutos', 'Fácil', NOW(), NOW(), 'lalalalalalalalalalaa'),
  (3, 'Pan con mermelada', 5, '60 minutos', 'Difícil', NOW(), NOW(), 'lalalalalalalalalalaa');
  
  INSERT INTO pasos (idReceta, titulo, descripcion)
  VALUES
  (1, 'Cortar el pan', 'Agarrá el pan, agarrá el cuchillo y cortá el pan por la mitad. Agregale mayonesa si querés. Opcional: Aderezos.'),
  (1, 'Preparar el relleno', 'Abrí el paquete con jamón (porque seguro lo compraste en el super) y ponele dos fetas al pan. No me seas rata. Hacé lo mismo con el queso.'),
  (1, 'Degustar', 'Cerrá los panes, aplastá el pan, abrí la boca y mandale un bocado.');

INSERT INTO ingredientes (idReceta, nombre)
VALUES
(1, '250g de jamón cocido'),
(1, '100g de queso feta'),
(1, 'un bollo de pan'),
(1, 'aderezo a gusto');