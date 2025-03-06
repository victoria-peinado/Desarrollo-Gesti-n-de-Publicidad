# Propuesta TP DSW

## Grupo
### Integrantes
* 47814, Peinado Victoria
* 49856, Del Solar Marcos
* 49491, Brancatti Lautaro

### Repositorios
* [fullstack app](https://github.com/victoria-peinado/Desarrollo-Gesti-n-de-Publicidad)

## Tema
### Descripción
La organización objeto de nuestro trabajo es una emisora de radio FM. Su equipo directivo nos encargó desarrollar un sistema que permita agilizar la gestión de publicidades de la misma. 
Esta es la minuta de relevamiento inicial. [Minuta relevamiento](https://docs.google.com/document/d/17VS5a1s4kwa8LozVOTpg5zMMIRsvXpUy/edit?usp=sharing&ouid=117489587614602605707&rtpof=true&sd=true)


### Modelo
![](https://github.com/victoria-peinado/Desarrollo-Gesti-n-de-Publicidad/blob/main/Documentacion/Modelo%20de%20Dominio%20-%20Publicidades-recortado.jpg)


## Alcance Funcional 

### Alcance Mínimo 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1.CRUD Contacto  <br>2. CRUD Titular Facturacción<br>3. CRUD Contratación<br> 4.CRUD Spot Publicitario <br>5.CRUD Bloque|
|CRUD dependiente|1. CRUD Comercio {depende de} CRUD Contacto y CRUD Titular Facturación<br>2. CRUD Orden publicitaria {depende de} CRUD Contratación <br>3. Historial Precio {depende de} CRUD Bloque|
|Listado<br>+<br>detalle| 1. Listado de publicidades filtrado por fecha desde a fecha hasta, muestra nroBloque(Bloque), nombreCampaña(Orden Publicitaria), horaInicio(Bloque) y fecha(Relacion) <br> 2. Listar para una contratacion todas las ordenes publicitarias|
|CUU/Epic|1. Realizar una contratación<br>2. Realizar Orden_Publicitaria|



### Alcance Aprobación directa

Adicionales para Aprobación:
|Req|Detalle|
|:-|:-|
|CRUD| 1. CRUD Contact <br> 2. CRUD Owner <br> 3. CRUD Shop <br> 4. CRUD Contract <br> 5. CRUD Order <br> 6. CRUD Spot <br> 7. CRUD Block <br> 8. CRUD Price <br> 9. CRUD DayOrderBlock |
|CUU/Epic| 1. Registrar una orden publicitaria y todas sus clases asociadas, calculando los atributos propios de sus relaciones. <br> 2. Renovar automaticamente ordenes publicitarias regulares en el ultimo día del mes (cron.schedule). <br> 3. Cargar un archivo de audio en el spot y poder reproducirlo (Multer). <br> 4. Emitir listado de deudores <br> 5. Emitir estado de deuda de un titular. <br> 6. Registrar el pago de una orden. <br> 7. Registrar cancelación de una orden. <br> 7. Listado de publicidades a emitir. 


