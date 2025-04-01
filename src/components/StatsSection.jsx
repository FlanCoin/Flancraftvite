// src/components/StatsSection.js
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { createChart } from "lightweight-charts";
import { onValue, push, ref, set, get } from "firebase/database";
import { database, playerHistoryRef } from "../firebase"; 
import './StatsSection.css';
console.log("createChart function: ", createChart);
function StatsSection() {
    const [onlinePlayers, setOnlinePlayers] = useState(0);
    const [showOnlineTrend, setShowOnlineTrend] = useState(false);
    const [weeklyAvg, setWeeklyAvg] = useState(0);
    const [monthlyAvg, setMonthlyAvg] = useState(0);
    const [dailyAvg, setDailyAvg] = useState(0);
    const [allTimeHigh, setAllTimeHigh] = useState(75);
    const [maxDailyAvg, setMaxDailyAvg] = useState(0);
    const [maxWeeklyAvg, setMaxWeeklyAvg] = useState(0);
    const [maxMonthlyAvg, setMaxMonthlyAvg] = useState(0);

    const [prevDailyAvg, setPrevDailyAvg] = useState(0);
    const [prevWeeklyAvg, setPrevWeeklyAvg] = useState(0);
    const [prevMonthlyAvg, setPrevMonthlyAvg] = useState(0);
    const [prevOnlinePlayers, setPrevOnlinePlayers] = useState(0);

    const playerHistory = useRef([]);
    const chartContainerRef = useRef();
    let chart = useRef();
    let lineSeries = useRef();

    const calculateStats = useCallback((data) => {
        if (!Array.isArray(data)) return;
        const validData = data.filter((num) => num.value !== null);
        const total = validData.reduce((sum, num) => sum + num.value, 0);
        const avg = validData.length ? Math.ceil(total / validData.length) : 0;

        setPrevDailyAvg(dailyAvg);
        setDailyAvg(avg);
        setMaxDailyAvg((prevMax) => Math.max(prevMax, avg));

        if (validData.length >= 7) {
            const weeklyTotal = validData.slice(-7).reduce((sum, num) => sum + num.value, 0);
            const weeklyAvg = Math.ceil(weeklyTotal / 7);
            setPrevWeeklyAvg(weeklyAvg);
            setWeeklyAvg(weeklyAvg);
            setMaxWeeklyAvg((prevMax) => Math.max(prevMax, weeklyAvg));
        } else {
            setWeeklyAvg(0);
        }

        if (validData.length >= 30) {
            const monthlyTotal = validData.slice(-30).reduce((sum, num) => sum + num.value, 0);
            const monthlyAvg = Math.ceil(monthlyTotal / 30);
            setPrevMonthlyAvg(monthlyAvg);
            setMonthlyAvg(monthlyAvg);
            setMaxMonthlyAvg((prevMax) => Math.max(prevMax, monthlyAvg));
        } else {
            setMonthlyAvg(0);
        }
    }, [dailyAvg]);

    useEffect(() => {
        onValue(playerHistoryRef, (snapshot) => {
            const data = snapshot.val();
            const history = data ? Object.values(data) : [];
            playerHistory.current = history;
            calculateStats(playerHistory.current);
            if (lineSeries.current) updateChartData();
        });

        const allTimeHighRef = ref(database, 'allTimeHigh');
        get(allTimeHighRef).then((snapshot) => {
            if (snapshot.exists()) {
                setAllTimeHigh(snapshot.val());
            }
        });
    }, [calculateStats]);

    const fetchOnlinePlayers = useCallback(async () => {
        try {
            const response = await fetch('https://api.mcsrvstat.us/2/play.flancraft.com');
            const data = await response.json();
            const playersOnline = data.players ? data.players.online : 0;
            setPrevOnlinePlayers(onlinePlayers);
            setOnlinePlayers(playersOnline);

            if (playersOnline > prevOnlinePlayers) {
                setShowOnlineTrend(true);
                setTimeout(() => setShowOnlineTrend(false), 5000);
            }

            const allTimeHighRef = ref(database, 'allTimeHigh');
            setAllTimeHigh((prevMax) => {
                const newMax = Math.max(prevMax, playersOnline);
                if (newMax > prevMax) {
                    set(allTimeHighRef, newMax);
                }
                return newMax;
            });

            const newEntry = { timestamp: Date.now(), value: playersOnline };
            await push(playerHistoryRef, newEntry);

            playerHistory.current.push(newEntry);
            calculateStats(playerHistory.current);
            if (lineSeries.current) updateChartData();
        } catch (error) {
            console.error('Error al obtener los datos de jugadores en línea:', error);
        }
    }, [calculateStats, onlinePlayers, prevOnlinePlayers]);

    const updateChartData = () => {
        if (!lineSeries.current) return;

        const seenTimestamps = new Set();
        const sortedData = playerHistory.current
            .map(entry => ({
                time: Math.floor(entry.timestamp / 1000),
                value: entry.value,
            }))
            .sort((a, b) => a.time - b.time);

        const uniqueData = sortedData.filter(entry => {
            if (seenTimestamps.has(entry.time)) return false;
            seenTimestamps.add(entry.time);
            return true;
        });

        lineSeries.current.setData(uniqueData);
    };

    useEffect(() => {
        fetchOnlinePlayers();
        const interval = setInterval(fetchOnlinePlayers, 60000);
        return () => clearInterval(interval);
    }, [fetchOnlinePlayers]);

    useEffect(() => {
        if (!chartContainerRef.current) return;
    
        const chartInstance = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: window.innerWidth < 768 ? 250 : 400,
            layout: {
                backgroundColor: '#e6e2d6',
                textColor: '#333333',
            },
            grid: {
                vertLines: { color: '#675545' },
                horzLines: { color: '#675545' },
            },
            timeScale: {
                borderColor: '#523930',
                timeVisible: true,
                secondsVisible: true,
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    color: '#8b785b',
                    width: 1,
                    style: 0,
                    labelBackgroundColor: '#8b785b',
                },
                horzLine: {
                    color: '#8b785b',
                    width: 1,
                    style: 0,
                    labelBackgroundColor: '#8b785b',
                },
            },
            handleScroll: {
                pressedMouseMove: true,
            },
            handleScale: {
                mouseWheel: true,
                pinch: true,
            },
        });
    
        chart.current = chartInstance;
        lineSeries.current = chartInstance.addLineSeries({
            color: '#4caf50',
            lineWidth: 2,
            crossHairMarkerVisible: true,
        });
    
        updateChartData();
    
        const resizeChart = () => {
            chartInstance.applyOptions({
                width: chartContainerRef.current.clientWidth,
            });
        };
    
        window.addEventListener('resize', resizeChart);
    
        return () => {
            window.removeEventListener('resize', resizeChart);
            chartInstance.remove();
            chart.current = null;
            lineSeries.current = null;
        };
    }, []);
    console.log("chart instance: ", chart.current);

    const getTrendIcon = (current, previous) => {
        if (current > previous) {
            return <span className="trend-icon up">▲</span>;
        }
        return null;
    };

    return (
        <div className="stats-background">
            <div className="poster-left"></div>
            <div className="poster-right"></div>

            <div className="stats-overlay">
                <div className="stats-content">
                    <h2 className="stats-title">Estadísticas de Jugadores</h2>

                    <div className="stats-cards">
                        <div className="stat-card">
                            <h3>Jugadores Online Actuales</h3>
                            <p>
                                {onlinePlayers} <span className="online-indicator"></span>
                                {showOnlineTrend && <span className="trend-icon up">▲</span>}
                            </p>
                        </div>
                        <div className="stat-card">
                            <h3>Media Diaria</h3>
                            <p>
                                {dailyAvg} {getTrendIcon(dailyAvg, prevDailyAvg)}
                            </p>
                            <small>Máximo de Hoy: {maxDailyAvg}</small>
                        </div>
                        <div className="stat-card">
                            <h3>Media Semanal</h3>
                            <p>
                                {weeklyAvg} {getTrendIcon(weeklyAvg, prevWeeklyAvg)}
                            </p>
                            <small>Máximo Semanal: {maxWeeklyAvg}</small>
                        </div>
                        <div className="stat-card">
                            <h3>Media Mensual</h3>
                            <p>
                                {monthlyAvg} {getTrendIcon(monthlyAvg, prevMonthlyAvg)}
                            </p>
                            <small>Máximo Mensual: {maxMonthlyAvg}</small>
                        </div>
                        <div className="stat-card">
                            <h3>Máximo Histórico</h3>
                            <p>{allTimeHigh}</p>
                        </div>
                    </div>

                    <div className="divider"></div>
                    <div ref={chartContainerRef} className="chart-container"></div>
                </div>
            </div>
        </div>
    );
}

export default StatsSection;
