# Propuesta TP DSW

## Grupo
### Integrantes
47814, Peinado Victoria
49856, Del Solar Marcos
49491, Brancatti Lautaro

### Repositorios
* [fullstack app](https://github.com/victoria-peinado/Desarrollo-Gesti-n-de-Publicidad)

## Tema
### Descripción
La organización objeto de nuestro trabajo es una emisora de radio FM. Su equipo directivo nos encargó desarrollar un sistema que permita agilizar la gestión de publicidades de la misma. 


### Modelo
![https://github.com/victoria-peinado/Desarrollo-Gesti-n-de-Publicidad/blob/main/Documentacion/model.jpeg]()


## Alcance Funcional 

### Alcance Mínimo 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Registo_Comercio<br>2. CRUD Registro_Contratación<br>3. CRUD Emision_Orden_Publicitaria<br> 4.Bloques<br>5. Dia|
|CRUD dependiente|1. CRUD Registro_Pagos {depende de} CRUD Emision_Orden_Publicitaria<br>2. CRUD Actualizacion_Precio_Bloques {depende de} CRUD Bloques<br>3.Emision_Orden_Publicitaria {depende de} CRUD Emision_Orden_Publicitaria|
|Listado<br>+<br>detalle| 1. Listado de publicidades filtrado por fecha desde a fecha hasta, muestra nroBloque(Bloque), nombreCampaña(Orden Publicitaria), horaInicio(Bloque) y fecha(Dia) <br> 2. Listar para una contratacion todas las ordenes publicitarias|
|CUU/Epic|1. Realizar una contratación<br>2. Realizar Orden_Publicitaria|



