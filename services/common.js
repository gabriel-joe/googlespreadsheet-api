const dateFormat = require('dateformat');

let paymentTypeArray = []
paymentTypeArray["cartão"] = "Bank"
paymentTypeArray["dinheiro"] = "Phisical"

let typeCastArray = []
typeCastArray["mercado"] = "Market"
typeCastArray["shopping"] = "Shopping"
typeCastArray["comida"] = "Food"
typeCastArray["apartamento"] = "Apt-Fees"
typeCastArray["transporte"] = "Transport"
typeCastArray["celular"] = "Cellphone"
typeCastArray["transferência"] = "Transfer"
typeCastArray["farmácia"] = "Farmacy"
typeCastArray["taxas"] = "Tax fees"
typeCastArray["outros"] = "Others"

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
      paymentType: common.paymentTypeArray[params.paymentType],
      type: common.typeCastArray[params.type],
      value: Number(params.value),
      description: params.description,
      date: params.date
    }
    return expense;
  
}

function formatDateMMYYYY(dateValue) {
  const date = new Date(dateValue);
  return dateFormat(date, 'mm/yyyy');
}

function formatDateDDMMYYYY(dateValue) {
  const date = new Date(dateValue);
  return dateFormat(date, 'yyyy-mm-dd');
}

module.exports = {
    paymentTypeArray: paymentTypeArray,
    typeCastArray: typeCastArray,
    capitalize: capitalize,
    validateFields: validateFields,
    formatDateMMYYYY: formatDateMMYYYY,
    formatDateDDMMYYYY: formatDateDDMMYYYY,
}