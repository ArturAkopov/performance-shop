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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7881548974943052, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "03 Список товаров"], "isController": true}, {"data": [1.0, 500, 1500, "06 Получить заказ"], "isController": true}, {"data": [1.0, 500, 1500, "04 Товар по ID"], "isController": true}, {"data": [1.0, 500, 1500, "GET /api/orders/{ORDER_ID}"], "isController": false}, {"data": [0.0, 500, 1500, "04 Генерация отчёта"], "isController": true}, {"data": [1.0, 500, 1500, "POST /api/auth/login"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/auth/profile"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/{product_id}"], "isController": false}, {"data": [1.0, 500, 1500, "05 Создать заказ"], "isController": true}, {"data": [1.0, 500, 1500, "01 Healthcheck"], "isController": true}, {"data": [1.0, 500, 1500, "POST /api/orders"], "isController": false}, {"data": [1.0, 500, 1500, "02 Профиль"], "isController": true}, {"data": [1.0, 500, 1500, "GET /api/products"], "isController": false}, {"data": [0.0, 500, 1500, "GET /api/reports/slow?delay=3"], "isController": false}, {"data": [1.0, 500, 1500, "01 Авторизация"], "isController": true}, {"data": [1.0, 500, 1500, "04 Товар"], "isController": true}, {"data": [0.0, 500, 1500, "03 Отчёт slow"], "isController": true}, {"data": [0.0, 500, 1500, "GET /api/reports/sales"], "isController": false}, {"data": [0.0, 500, 1500, "POST /api/reports/generate?period=month"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/health"], "isController": false}, {"data": [0.0, 500, 1500, "02 Отчёт sales"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 438, 0, 0.0, 815.0593607305937, 3, 7019, 18.0, 3006.0, 5019.0, 7019.0, 0.06015518389357312, 0.041123183078250636, 0.01164806572757283], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03 Список товаров", 67, 0, 0.0, 10.850746268656714, 9, 13, 11.0, 12.0, 12.0, 13.0, 0.009332137891112336, 0.02108844441409565, 0.001421692881849145], "isController": true}, {"data": ["06 Получить заказ", 21, 0, 0.0, 24.190476190476193, 0, 29, 25.0, 27.0, 28.799999999999997, 29.0, 0.002950501128566682, 9.77737678672162E-4, 4.335743845922021E-4], "isController": true}, {"data": ["04 Товар по ID", 46, 0, 0.0, 23.152173913043473, 10, 27, 24.0, 25.300000000000004, 26.65, 27.0, 0.006540375801462627, 0.002512623991662443, 0.0010091595474913037], "isController": true}, {"data": ["GET /api/orders/{ORDER_ID}", 20, 0, 0.0, 25.400000000000002, 23, 29, 25.5, 27.0, 28.9, 29.0, 0.0029541006609800228, 0.0010278770170968575, 4.5580850042465195E-4], "isController": false}, {"data": ["04 Генерация отчёта", 31, 0, 0.0, 5791.774193548388, 3018, 7019, 6019.0, 7019.0, 7019.0, 7019.0, 0.00440463475560884, 0.001182885310344171, 8.473760223192789E-4], "isController": true}, {"data": ["POST /api/auth/login", 98, 0, 0.0, 16.081632653061213, 9, 381, 12.0, 14.0, 16.099999999999994, 381.0, 0.013678708629408749, 0.004675339863567444, 0.002952143170995443], "isController": false}, {"data": ["GET /api/auth/profile", 67, 0, 0.0, 17.820895522388064, 5, 21, 18.0, 19.0, 20.0, 21.0, 0.009332130092122052, 0.00212342413228949, 0.0026702286298747667], "isController": false}, {"data": ["GET /api/products/{product_id}", 67, 0, 0.0, 23.462686567164173, 10, 27, 24.0, 25.0, 26.599999999999994, 27.0, 0.009311469632031565, 0.0035821905531110247, 0.0014367306658798708], "isController": false}, {"data": ["05 Создать заказ", 21, 0, 0.0, 16.38095238095238, 13, 29, 16.0, 18.8, 27.999999999999986, 29.0, 0.0029444355566111903, 6.550492793353764E-4, 5.865867710436356E-4], "isController": true}, {"data": ["01 Healthcheck", 5, 0, 0.0, 4.0, 3, 5, 4.0, 5.0, 5.0, 5.0, 8.776096160738764E-4, 1.9969046928243478E-4, 1.3198425866736032E-4], "isController": true}, {"data": ["POST /api/orders", 21, 0, 0.0, 16.38095238095238, 13, 29, 16.0, 18.8, 27.999999999999986, 29.0, 0.002950493252221932, 6.563969363202067E-4, 5.877935775910881E-4], "isController": false}, {"data": ["02 Профиль", 67, 0, 0.0, 17.820895522388064, 5, 21, 18.0, 19.0, 20.0, 21.0, 0.0093518563365038, 0.002127912623442759, 0.0026758729556597785], "isController": true}, {"data": ["GET /api/products", 67, 0, 0.0, 10.850746268656714, 9, 13, 11.0, 12.0, 12.0, 13.0, 0.00931042671909039, 0.021039382253881994, 0.0014183853204864268], "isController": false}, {"data": ["GET /api/reports/slow?delay=3", 31, 0, 0.0, 3006.0645161290327, 3004, 3019, 3005.0, 3007.8, 3012.4, 3019.0, 0.0044058867763846175, 0.0011057743179012174, 7.228407992506012E-4], "isController": false}, {"data": ["01 Авторизация", 99, 0, 0.0, 15.919191919191908, 0, 381, 12.0, 14.0, 16.0, 381.0, 0.013676025995500725, 0.004627206554269994, 0.002921750424267625], "isController": true}, {"data": ["04 Товар", 21, 0, 0.0, 24.142857142857142, 22, 27, 24.0, 25.0, 26.799999999999997, 27.0, 0.002944273318294172, 0.0011361411828127344, 4.5429217215867113E-4], "isController": true}, {"data": ["03 Отчёт slow", 31, 0, 0.0, 3006.0645161290327, 3004, 3019, 3005.0, 3007.8, 3012.4, 3019.0, 0.004405347068163367, 0.001105638863787095, 7.227522533705523E-4], "isController": true}, {"data": ["GET /api/reports/sales", 31, 0, 0.0, 2526.5161290322576, 2515, 2531, 2527.0, 2529.0, 2529.8, 2531.0, 0.004405648211548426, 0.006342695593371177, 6.926849238860319E-4], "isController": false}, {"data": ["POST /api/reports/generate?period=month", 31, 0, 0.0, 5791.774193548388, 3018, 7019, 6019.0, 7019.0, 7019.0, 7019.0, 0.004404395074806519, 0.0011828209429412039, 8.473299118524261E-4], "isController": false}, {"data": ["GET /api/health", 5, 0, 0.0, 4.0, 3, 5, 4.0, 5.0, 5.0, 5.0, 8.778065230153848E-4, 1.9973527330330535E-4, 1.3201387162536062E-4], "isController": false}, {"data": ["02 Отчёт sales", 31, 0, 0.0, 2526.5161290322576, 2515, 2531, 2527.0, 2529.0, 2529.8, 2531.0, 0.004406086539519328, 0.006343326642596169, 6.927538406861442E-4], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 438, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
