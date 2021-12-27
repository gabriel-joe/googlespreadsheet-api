const months = ["01", "02", "03", "04", "05", "06", "07","08","09","10","11","12"]

let monthsMarket = []
monthsMarket["04/2021"] = 4
monthsMarket["05/2021"] = 5
monthsMarket["06/2021"] = 6
monthsMarket["07/2021"] = 7
monthsMarket["08/2021"] = 8

let paymentTypeArray = []
paymentTypeArray["cartão"] = "Bank"
paymentTypeArray["dinheiro"] = "Phisical"

let typeCastArray = []
typeCastArray["mercado"] = "Market"
typeCastArray["shopping"] = "Shopping"
typeCastArray["comida"] = "Food"
typeCastArray["apartamento"] = "Apt-Fees"
typeCastArray["vida"] = "Lifestyle"
typeCastArray["aluguel"] = "Rent"
typeCastArray["transporte"] = "Transport"
typeCastArray["celular"] = "Cellphone"
typeCastArray["transferência"] = "Transfer"
typeCastArray["farmácia"] = "Health"
typeCastArray["saúde"] = "Health"
typeCastArray["taxas"] = "Tax fees"
typeCastArray["outros"] = "Others"

default_range = 'Per Month!A38:F38'

function capitalize (s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function validateFields(params) {
    if(!params.date)
        throw 'Date is required'
    if(!params.paymentType)
        throw 'Payment type is required'
    if(!params.type)
        throw 'Type is required'
    if(!params.value)
        throw 'Value is required'
    if(!params.description)
        throw 'Description is required'
  
    let expense = {
      month: formatDateMMYYYY(params.date),
      paymentType: paymentTypeArray[params.paymentType],
      type: typeCastArray[params.type],
      value: Number(params.value),
      description: params.description,
      date: params.date
    }
    return expense;
  
}

function getDefaultExpense(params) {
    
    if(params.defaultExpense === 'internet'){
        params.type = "apartamento"
        params.value = 27
        params.description = "NOS"
    } else if (params.defaultExpense === 'aluguel'){
        params.type = "aluguel"
        params.value = 600
        params.description = "Aluguel"
    } else if (params.defaultExpense === 'celular'){
        params.type = "celular"
        params.value = 24
        params.description = "Vodafone"
    } else if (params.defaultExpense === 'academia'){
        params.type = "vida"
        params.value = 11
        params.description = "Academia"
    } 

    let expense = {
      month: formatDateMMYYYY(params.date),
      paymentType: paymentTypeArray["cartão"],
      type: typeCastArray[params.type],
      value: Number(params.value),
      description: params.description,
      date: params.date
    }
    return expense;
  
}

function formatDateMMYYYY(dateValue) {
  const date = new Date(dateValue);
  return `${months[date.getMonth()]}/${date.getFullYear()}`
}

function formatDateDDMMYYYY(dateValue) {
  const date = new Date(dateValue);
  return `${date.getFullYear()}-${months[date.getMonth()]}-${date.getDate()}`
}



module.exports = {
    paymentTypeArray: paymentTypeArray,
    typeCastArray: typeCastArray,
    monthsMarket: monthsMarket,
    capitalize: capitalize,
    validateFields: validateFields,
    formatDateMMYYYY: formatDateMMYYYY,
    formatDateDDMMYYYY: formatDateDDMMYYYY,
    getDefaultExpense: getDefaultExpense,
    sheetsDefaultRange: default_range,
}