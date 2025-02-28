import { format } from "date-fns"
import { BlocksRegularType } from "../order/order.entity.js"





export function getMonthString(month: Number){
    switch (month){
        case 0: return "Enero"
        case 1: return "Febrero"
        case 2: return "Marzo"
        case 3: return "Abril"
        case 4: return "Mayo"
        case 5: return "Junio"
        case 6: return "Julio"
        case 7: return "Agosto"
        case 8: return "Septiembre"
        case 9: return "Octubre"
        case 10: return "Noviembre"
        case 11: return "Diciembre"
    }
}

export function getDayString(day: Number){
    switch(day){
        case 0: return "Domingo"
        case 1: return "Lunes"
        case 2: return "Martes"
        case 3: return "Miercoles"
        case 4: return "Jueves"
        case 5: return "Viernes"
        case 6: return "Sabado"
    }
}

export function rewriteDaysArray(regStructure: BlocksRegularType): string[][]{
    let daysArray = []
    daysArray[0] = regStructure['sunday']
    daysArray[1] = regStructure['monday']
    daysArray[2] = regStructure['tuesday']
    daysArray[3] = regStructure['wednesday']
    daysArray[4] = regStructure['thursday']
    daysArray[5] = regStructure['friday']
    daysArray[6] = regStructure['saturday']

    return daysArray
}

export function getNextMonthString(): string {
    const hoy = new Date()
    const manana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
    return format(manana, 'MM-yyyy')
}