@echo off
REM ============================================================
REM  Запуск нагрузочных тестов Performance Shop
REM ============================================================

set HOST=localhost
set PORT=80

echo ============================================================
echo  1x: Базовый уровень (1 RPS) - 2 часа
echo ============================================================
jmeter -n -t performance_shop.jmx -l ../results/logs/run_1x_1rps.jtl -e -o ../results/reports/1x_1rps -Jhost=%HOST% -Jport=%PORT% -Jrps=1

echo ============================================================
echo  2x: Двукратная нагрузка (2 RPS) - 2 часа
echo ============================================================
jmeter -n -t performance_shop.jmx -l ../results/logs/run_2x_2rps.jtl -e -o ../results/reports/2x_2rps -Jhost=%HOST% -Jport=%PORT% -Jrps=2

echo ============================================================
echo  3x: Трёхкратная нагрузка (3 RPS) - 2 часа
echo ============================================================
jmeter -n -t performance_shop.jmx -l ../results/logs/run_3x_3rps.jtl -e -o ../results/reports/3x_3rps -Jhost=%HOST% -Jport=%PORT% -Jrps=3

echo ============================================================
echo  Все тесты завершены!
echo ============================================================
pause