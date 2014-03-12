/**
 * Created by arein on 09/03/14.
 */

/*******
 * Monthly Data
 */
var labels = [];
var totalLetterCount = [];
var averagePageCount = [];
var totalPageCount = [];
var averagePrice = [];
var totalPrice = [];
var averageNet = [];
var totalNet = [];
var averageVat = [];
var totalVat = [];
var averageReturn = [];
var totalReturn = [];
var averagePrintingPrice = [];
var totalPrintingPrice = [];
monthly.forEach(function(month) {
    labels.push( month._id.month + "-" + month._id.year);
    averagePageCount.push(month.pagesAvg);
    totalPageCount.push(month.pagesTotal);
    averagePrice.push(month.priceAvg);
    totalPrice.push(month.priceTotal);
    averageNet.push(month.netAvg);
    totalNet.push(month.netTotal);
    averageVat.push(month.vatAvg);
    totalVat.push(month.vatTotal);
    averageReturn.push(month.marginAppliedAvg + month.vatIncomeAvg);
    totalReturn.push(month.marginAppliedTotal + month.vatIncomeTotal);
    averagePrintingPrice.push(month.printingPriceAvg);
    totalPrintingPrice.push(month.printingPriceTotal);
    totalLetterCount.push(month.count);
});

createChart(document.getElementById("totalLetterCount").getContext("2d"), getChartData(totalLetterCount));
createChart(document.getElementById("totalReturn").getContext("2d"), getChartData(totalReturn));
createChart(document.getElementById("averageReturn").getContext("2d"), getChartData(averageReturn));
createChart(document.getElementById("totalPrintingPrice").getContext("2d"), getChartData(totalPrintingPrice));
createChart(document.getElementById("averagePrintingPrice").getContext("2d"), getChartData(averagePrintingPrice));
createChart(document.getElementById("averagePageCount").getContext("2d"), getChartData(averagePageCount));
createChart(document.getElementById("totalPageCount").getContext("2d"), getChartData(totalPageCount));
createChart(document.getElementById("averagePrice").getContext("2d"), getChartData(averagePrice));
createChart(document.getElementById("totalPrice").getContext("2d"), getChartData(totalPrice));
createChart(document.getElementById("averageNet").getContext("2d"), getChartData(averageNet));
createChart(document.getElementById("totalNet").getContext("2d"), getChartData(totalNet));
createChart(document.getElementById("averageVat").getContext("2d"), getChartData(averageVat));
createChart(document.getElementById("totalVat").getContext("2d"), getChartData(totalVat));

function getChartData(data) {
    return {
        labels : labels,
        datasets : [
            {
                fillColor : "rgba(220,220,220,0.5)",
                strokeColor : "rgba(220,220,220,1)",
                pointColor : "rgba(220,220,220,1)",
                pointStrokeColor : "#fff",
                data : data
            }
        ]
    }
}

function createChart(context, data, type) {
    if (type == undefined) {
        new Chart(context).Bar(data)
    } else {
        new Chart(context).Pie(data, {animation : false})
    }
}

/*******
 * Country Data
 */
var recipientCountryData = [];
var billingCountryData = [];
recipientCountry.forEach(function(country) {
    //recipientCountryLabels.push( country._id.recipientCountry);
    recipientCountryData.push({
        value: country.count,
        color: getRandomColor(),
        label : country._id.recipientCountry,
        labelColor : 'white',
        labelFontSize : '16'
    });
});
billingCountry.forEach(function(country) {
    billingCountryData.push({
        value: country.count,
        color: getRandomColor(),
        label : country._id.recipientCountry,
        labelColor : 'white',
        labelFontSize : '16'
    });
});

createChart(document.getElementById("destinationCountries").getContext("2d"), recipientCountryData, "doughnut");
createChart(document.getElementById("billingCountries").getContext("2d"), billingCountryData, "doughnut");

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}