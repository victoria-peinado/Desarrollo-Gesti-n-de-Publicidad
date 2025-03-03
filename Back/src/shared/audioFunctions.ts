//DOCUMENTACION:
//YOUTUBE: https://www.youtube.com/watch?v=wsn6PyQLtfY
//https://github.com/expressjs/multer/blob/master/doc/README-es.md

//No te olvides de enctype="multipart/form-data" en tu formulario
//  <input type="file" name="audio" />


import multer, { FileFilterCallback } from 'multer';
import path, { dirname, extname } from 'path';
import { CallbackHandler } from 'supertest';
import { fileURLToPath } from 'url';

export function destDir(){
    const CURRENT_DIR = dirname(fileURLToPath(import.meta.url)) //directorio actual hasta src
    //pensar que cuando esto se ejecute va a estar compilado, por ende, los archivos de audio pasaran...
    console.log('El directorio actual es: ', CURRENT_DIR)
    const DEST_DIR = path.resolve( CURRENT_DIR, '../../../audios')
    console.log('El directorio de DESTINO es: ', DEST_DIR)
    return DEST_DIR

}

const MIMETYPES = ['audio/aac', 'audio/mpeg' ] //aceptamos mp3 o acc



const storage = multer.diskStorage({
    destination: destDir(),
    filename: (req, audio, cb) => { //nos garantiza la extension y que los archivos sean unicos
        const fileExtension = extname(audio.originalname)
        const fileName = audio.originalname.split(fileExtension)[0]
        const storageName = fileName + '-' + Date.now() + fileExtension //el nombre es el nombre original + la fecha en mSeg + extension
        cb(null, storageName)
    }
})


export const multerUploads = multer({
    storage: storage,
    limits:{
        fieldSize: 100000000, // 100MB
    },
    fileFilter: (req, audio, cb) => {
            if(MIMETYPES.includes(audio.mimetype)){
                cb(null, true)
            } else {cb(new Error('Tipo de archivo no permitido. Solo se permiten: '+ MIMETYPES))}
    }
})
