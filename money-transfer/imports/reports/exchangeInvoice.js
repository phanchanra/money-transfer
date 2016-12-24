// Page
import './../reports/exchangeInvoice.html';

// Declare template
let indexTmpl = Template.generateExchangeInvoice;

indexTmpl.helpers({
    no(index){
        return index + 1;
    }
});
