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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7899543378995434, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "03 Список товаров"], "isController": true}, {"data": [1.0, 500, 1500, "06 Получить заказ"], "isController": true}, {"data": [1.0, 500, 1500, "04 Товар по ID"], "isController": true}, {"data": [0.0, 500, 1500, "04 Генерация отчёта"], "isController": true}, {"data": [1.0, 500, 1500, "GET /api/orders/{ORDER_ID}"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/auth/login"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/auth/profile"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/{product_id}"], "isController": false}, {"data": [1.0, 500, 1500, "05 Создать заказ"], "isController": true}, {"data": [1.0, 500, 1500, "01 Healthcheck"], "isController": true}, {"data": [1.0, 500, 1500, "POST /api/orders"], "isController": false}, {"data": [1.0, 500, 1500, "02 Профиль"], "isController": true}, {"data": [1.0, 500, 1500, "GET /api/products"], "isController": false}, {"data": [0.0, 500, 1500, "GET /api/reports/slow?delay=3"], "isController": false}, {"data": [1.0, 500, 1500, "01 Авторизация"], "isController": true}, {"data": [1.0, 500, 1500, "04 Товар"], "isController": true}, {"data": [0.016129032258064516, 500, 1500, "03 Отчёт slow"], "isController": true}, {"data": [0.0, 500, 1500, "GET /api/reports/sales"], "isController": false}, {"data": [0.0, 500, 1500, "POST /api/reports/generate?period=month"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/health"], "isController": false}, {"data": [0.0, 500, 1500, "02 Отчёт sales"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 875, 0, 0.0, 750.3485714285711, 4, 7020, 23.0, 3019.0, 4019.0, 6256.6400000000085, 0.12014947968409612, 0.08244265737350491, 0.02326608853025604], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03 Список товаров", 134, 0, 0.0, 23.932835820895516, 10, 30, 24.0, 26.0, 27.0, 29.30000000000001, 0.018554021417986934, 0.04192503545341182, 0.002826589200396447], "isController": true}, {"data": ["06 Получить заказ", 41, 0, 0.0, 24.634146341463413, 10, 32, 25.0, 26.0, 28.799999999999997, 32.0, 0.005788140777183544, 0.002014902759587879, 8.930920339794922E-4], "isController": true}, {"data": ["04 Товар по ID", 93, 0, 0.0, 23.3763440860215, 11, 27, 24.0, 25.60000000000001, 26.0, 27.0, 0.012862364265751935, 0.0049391359924634845, 0.001984622611317193], "isController": true}, {"data": ["04 Генерация отчёта", 61, 0, 0.0, 4969.11475409836, 3017, 7020, 5019.0, 7018.8, 7019.0, 7020.0, 0.008604724219294077, 0.0023108390237362025, 0.0016554010460946612], "isController": true}, {"data": ["GET /api/orders/{ORDER_ID}", 41, 0, 0.0, 24.634146341463413, 10, 32, 25.0, 26.0, 28.799999999999997, 32.0, 0.005788753694036694, 0.002015116121340184, 8.931866051345681E-4], "isController": false}, {"data": ["POST /api/auth/login", 197, 0, 0.0, 11.857868020304569, 9, 69, 11.0, 13.0, 14.0, 26.86000000000044, 0.027093964619958322, 0.009260632438462316, 0.005847427911143349], "isController": false}, {"data": ["GET /api/auth/profile", 134, 0, 0.0, 17.641791044776124, 4, 21, 18.0, 19.0, 20.0, 21.0, 0.01855402912511799, 0.004221766392727042, 0.0053089165367769245], "isController": false}, {"data": ["GET /api/products/{product_id}", 134, 0, 0.0, 23.253731343283576, 11, 27, 24.0, 26.0, 26.0, 27.0, 0.018511667461931582, 0.007116987124582693, 0.002856292440415225], "isController": false}, {"data": ["05 Создать заказ", 41, 0, 0.0, 15.195121951219512, 12, 22, 15.0, 17.800000000000004, 18.0, 22.0, 0.005787985525518734, 0.0012879039819787541, 0.0011530752414119353], "isController": true}, {"data": ["01 Healthcheck", 10, 0, 0.0, 4.5, 4, 5, 4.5, 5.0, 5.0, 5.0, 0.0015708507900672592, 3.574299160992885E-4, 2.362412320999589E-4], "isController": true}, {"data": ["POST /api/orders", 41, 0, 0.0, 15.195121951219512, 12, 22, 15.0, 17.800000000000004, 18.0, 22.0, 0.00578814731427847, 0.001287939982135801, 0.001153107472766414], "isController": false}, {"data": ["02 Профиль", 135, 0, 0.0, 17.511111111111116, 0, 21, 18.0, 19.0, 20.0, 21.0, 0.01862290385422377, 0.004206049653765731, 0.005289152568898537], "isController": true}, {"data": ["GET /api/products", 134, 0, 0.0, 23.932835820895516, 10, 30, 24.0, 26.0, 27.0, 29.30000000000001, 0.01853285356293418, 0.04187720414754198, 0.002823364409978254], "isController": false}, {"data": ["GET /api/reports/slow?delay=3", 61, 0, 0.0, 3018.0327868852464, 3003, 3021, 3019.0, 3020.0, 3020.0, 3021.0, 0.008608385357616318, 0.002160502965729877, 0.0014123132227339273], "isController": false}, {"data": ["01 Авторизация", 197, 0, 0.0, 11.857868020304569, 9, 69, 11.0, 13.0, 14.0, 26.86000000000044, 0.02711681123918872, 0.009268441341519582, 0.005852358675645221], "isController": true}, {"data": ["04 Товар", 41, 0, 0.0, 22.97560975609757, 11, 27, 24.0, 26.0, 26.0, 27.0, 0.005788461929427073, 0.002231475236465729, 8.931415867670678E-4], "isController": true}, {"data": ["03 Отчёт slow", 62, 0, 0.0, 2969.354838709678, 0, 3021, 3019.0, 3020.0, 3020.0, 3021.0, 0.008575322241937779, 0.0021174919163756706, 0.0013841970503934344], "isController": true}, {"data": ["GET /api/reports/sales", 62, 0, 0.0, 2526.4193548387107, 2514, 2533, 2527.0, 2529.0, 2529.0, 2533.0, 0.008572329653637785, 0.012568600456918997, 0.0013477979240582845], "isController": false}, {"data": ["POST /api/reports/generate?period=month", 61, 0, 0.0, 4969.11475409836, 3017, 7020, 5019.0, 7018.8, 7019.0, 7020.0, 0.008604107657416028, 0.0023106734431537186, 0.001655282430186482], "isController": false}, {"data": ["GET /api/health", 10, 0, 0.0, 4.5, 4, 5, 4.5, 5.0, 5.0, 5.0, 0.0015707360563404175, 3.5740380969464576E-4, 2.362239772230706E-4], "isController": false}, {"data": ["02 Отчёт sales", 62, 0, 0.0, 2526.4193548387107, 2514, 2533, 2527.0, 2529.0, 2529.0, 2533.0, 0.008563498061887019, 0.01255565173089014, 0.0013464093632459082], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 875, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
