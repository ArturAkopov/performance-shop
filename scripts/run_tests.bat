@echo off
REM ============================================================
REM  Запуск нагрузочных тестов Performance Shop
REM ============================================================

set HOST=localhost
set PORT=80

echo ============================================================
echo  1x: Базовый уровень (1 RPS) - 2 часа
echo ============================================================
jmeter -n -t scripts/performance_shop.jmx -l results/logs/run_1x.jtl -e -o results/reports/1x -Jhost=%HOST% -Jport=%PORT% -Jtarget_throughput=3.6

echo ============================================================
echo  2x: Двукратная нагрузка (2 RPS) - 2 часа
echo ============================================================
jmeter -n -t scripts/performance_shop.jmx -l results/logs/run_2x.jtl -e -o results/reports/2x -Jhost=%HOST% -Jport=%PORT% -Jtarget_throughput=7.2

echo ============================================================
echo  3x: Трёхкратная нагрузка (3 RPS) - 2 часа
echo ============================================================
jmeter -n -t scripts/performance_shop.jmx -l results/logs/run_3x.jtl -e -o results/reports/3x -Jhost=%HOST% -Jport=%PORT% -Jtarget_throughput=10.8

echo ============================================================
echo  Все тесты завершены!
echo ============================================================
pause