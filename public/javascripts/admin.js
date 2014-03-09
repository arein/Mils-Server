/**
 * Created by arein on 09/03/14.
 */

var labels = [];
var averagePageCount = [];
var totalPageCount = [];
var averagePrice = [];
var totalPrice = [];
var averageNet = [];
var totalNet = [];
var averageVat = [];
var totalVat = [];
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
});


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

function createChart(context, data) {
    new Chart(context).Bar(data)
}