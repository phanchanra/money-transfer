 //
 // printDiv=function(divID) {
 //    //Get the HTML of div
 //    // var divElements = document.getElementById(divID).innerHTML;
 //    // //Get the HTML of whole page
 //    // var oldPage = document.body.innerHTML;
 //    //
 //    // //Reset the page's HTML with div's HTML only
 //    // document.body.innerHTML =
 //    //     "<nav>" +
 //    //     divElements + "</nav>";
 //    //
 //    // //Print Page
 //    // window.print();
 //    //
 //    // //Restore orignal HTML
 //    // document.body.innerHTML = oldPage;
 //    //window.location='index.php?overdue';
 //    //  var divToPrint=document.getElementById('print-invoice');
 //    //
 //    //  var newWin=window.open('','Print-Window');
 //    //
 //    //  newWin.document.open();
 //    //
 //    //  newWin.document.write('<html><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');
 //    //
 //    //  newWin.document.close();
 //    //
 //    //  //setTimeout(function(){newWin.close();},10);
 //
 //
 //
 // }
 export const calculateIncome = function (fee, expend) {
        let resultIncome=fee-expend;
        return resultIncome;
 };