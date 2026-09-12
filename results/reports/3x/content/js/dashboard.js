/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.785876993166287, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "03 Список товаров"], "isController": true}, {"data": [1.0, 500, 1500, "06 Получить заказ"], "isController": true}, {"data": [1.0, 500, 1500, "04 Товар по ID"], "isController": true}, {"data": [0.0, 500, 1500, "04 Генерация отчёта"], "isController": true}, {"data": [1.0, 500, 1500, "GET /api/orders/{ORDER_ID}"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/auth/login"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/auth/profile"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/{product_id}"], "isController": false}, {"data": [1.0, 500, 1500, "05 Создать заказ"], "isController": true}, {"data": [1.0, 500, 1500, "01 Healthcheck"], "isController": true}, {"data": [1.0, 500, 1500, "POST /api/orders"], "isController": false}, {"data": [1.0, 500, 1500, "02 Профиль"], "isController": true}, {"data": [1.0, 500, 1500, "GET /api/products"], "isController": false}, {"data": [0.0, 500, 1500, "GET /api/reports/slow?delay=3"], "isController": false}, {"data": [1.0, 500, 1500, "01 Авторизация"], "isController": true}, {"data": [1.0, 500, 1500, "04 Товар"], "isController": true}, {"data": [0.0, 500, 1500, "03 Отчёт slow"], "isController": true}, {"data": [0.0, 500, 1500, "GET /api/reports/sales"], "isController": false}, {"data": [0.0, 500, 1500, "POST /api/reports/generate?period=month"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/health"], "isController": false}, {"data": [0.0, 500, 1500, "02 Отчёт sales"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 0, 0.0, 760.7765957446809, 3, 7020, 19.0, 3018.0, 4017.0, 7014.959999999999, 0.1803085276205673, 0.12343921715271187, 0.034914787308211535], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03 Список товаров", 201, 0, 0.0, 20.98009950248757, 0, 29, 24.0, 25.0, 26.0, 26.0, 0.02776824923122704, 0.062437412429855815, 0.0042092728545470096], "isController": true}, {"data": ["06 Получить заказ", 61, 0, 0.0, 22.803278688524593, 10, 27, 25.0, 26.0, 27.0, 27.0, 0.008652134956852086, 0.003010739072459928, 0.0013349973859205367], "isController": true}, {"data": ["04 Товар по ID", 139, 0, 0.0, 21.187050359712238, 9, 26, 24.0, 25.0, 25.0, 26.0, 0.01934961893779223, 0.0074282112606708275, 0.00298558573454216], "isController": true}, {"data": ["04 Генерация отчёта", 94, 0, 0.0, 4929.574468085108, 3004, 7020, 5006.5, 7018.5, 7019.0, 7020.0, 0.012964453262111592, 0.0034816646944147342, 0.002494137981089828], "isController": true}, {"data": ["GET /api/orders/{ORDER_ID}", 61, 0, 0.0, 22.786885245901637, 10, 27, 25.0, 26.0, 27.0, 27.0, 0.008653073869731236, 0.003011065792015851, 0.0013351422572436867], "isController": false}, {"data": ["POST /api/auth/login", 296, 0, 0.0, 10.929054054054054, 9, 61, 11.0, 12.0, 12.0, 15.149999999999864, 0.040669994186664005, 0.013900876919269924, 0.00877741085473901], "isController": false}, {"data": ["GET /api/auth/profile", 201, 0, 0.0, 15.636815920398007, 4, 22, 18.0, 19.0, 19.899999999999977, 20.97999999999999, 0.027768176343668897, 0.006318344812573098, 0.007945386395209947], "isController": false}, {"data": ["GET /api/products/{product_id}", 200, 0, 0.0, 21.000000000000004, 9, 26, 24.0, 25.0, 25.0, 26.0, 0.02779852242513754, 0.010684921322189461, 0.004289225139816143], "isController": false}, {"data": ["05 Создать заказ", 61, 0, 0.0, 14.442622950819674, 12, 17, 15.0, 16.0, 16.0, 17.0, 0.00865262095690328, 0.0019244823090781456, 0.0017237643312580755], "isController": true}, {"data": ["01 Healthcheck", 15, 0, 0.0, 4.0, 3, 5, 4.0, 5.0, 5.0, 5.0, 0.002260601543056472, 5.14375155793123E-4, 3.3997327893622723E-4], "isController": true}, {"data": ["POST /api/orders", 61, 0, 0.0, 14.442622950819674, 12, 17, 15.0, 16.0, 16.0, 17.0, 0.00865213004803918, 0.0019243731230374026, 0.0017236665330078052], "isController": false}, {"data": ["02 Профиль", 202, 0, 0.0, 15.559405940594056, 0, 22, 18.0, 19.0, 19.849999999999994, 20.97, 0.027765143721043325, 0.006286379253788396, 0.007905189362060085], "isController": true}, {"data": ["GET /api/products", 200, 0, 0.0, 21.085000000000008, 9, 29, 24.0, 25.0, 26.0, 26.0, 0.027841112441761615, 0.06291425291472086, 0.00424141947354962], "isController": false}, {"data": ["GET /api/reports/slow?delay=3", 94, 0, 0.0, 3015.1808510638293, 3003, 3021, 3018.0, 3020.0, 3020.0, 3021.0, 0.012966236196820845, 0.003254221389241169, 0.0021272731260409197], "isController": false}, {"data": ["01 Авторизация", 296, 0, 0.0, 10.929054054054054, 9, 61, 11.0, 12.0, 12.0, 15.149999999999864, 0.04070722756825474, 0.013913603172743321, 0.008785446574789354], "isController": true}, {"data": ["04 Товар", 61, 0, 0.0, 20.57377049180328, 9, 26, 24.0, 25.0, 25.0, 26.0, 0.008652012238200392, 0.0033349529114233938, 0.0013349784508160762], "isController": true}, {"data": ["03 Отчёт slow", 94, 0, 0.0, 3015.1808510638293, 3003, 3021, 3018.0, 3020.0, 3020.0, 3021.0, 0.012957008507930171, 0.003251905455603568, 0.0021257592083322938], "isController": true}, {"data": ["GET /api/reports/sales", 94, 0, 0.0, 2523.9255319148942, 2513, 2530, 2527.0, 2528.0, 2529.0, 2530.0, 0.012957883707404921, 0.019044949735473077, 0.0020373235125900314], "isController": false}, {"data": ["POST /api/reports/generate?period=month", 94, 0, 0.0, 4929.574468085108, 3004, 7020, 5006.5, 7018.5, 7019.0, 7020.0, 0.012986623639495749, 0.003487618653184894, 0.0024984031806451782], "isController": false}, {"data": ["GET /api/health", 15, 0, 0.0, 4.0, 3, 5, 4.0, 5.0, 5.0, 5.0, 0.0022602683993381938, 5.142993525837882E-4, 3.399231772442205E-4], "isController": false}, {"data": ["02 Отчёт sales", 94, 0, 0.0, 2523.9255319148942, 2513, 2530, 2527.0, 2528.0, 2529.0, 2530.0, 0.012949697176842028, 0.01903291751890139, 0.0020360363725308267], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
