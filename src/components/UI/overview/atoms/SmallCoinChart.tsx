import React from 'react';
import { Theme, makeStyles, useTheme } from '@material-ui/core/styles';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import { Coin, CoinMarketChart } from '../../../../models';
import { useAppSelector } from '../../../../app/hooks';
import { selectCoinMarketChartList } from '../../../../features/coinMarketChartListSlice';

const useStyles = makeStyles((theme: Theme) => ({
  responsiveContainer: {
    '& .recharts-surface': {
      cursor: 'pointer'
    }
  }
}));

interface DataFormat {
  date: number;
  value: number;
}

interface Props {
  coin: Coin;
  dataKey: keyof CoinMarketChart;
}

const SmallCoinChart: React.FC<Props> = ({ coin, dataKey }) => {
  const classes = useStyles();
  const theme = useTheme();

  const coinMarketChartList = useAppSelector(selectCoinMarketChartList);
  const gain = coin.priceChangePercentage24H >= 0;

  const formatRawData = (coinId: string, dataKey: keyof CoinMarketChart) => {
    const chartData: DataFormat[] = [];
    coinMarketChartList.value[1][coinId][dataKey]
      .forEach((dataPair: [number, number]) => {
        chartData.push({ date: dataPair[0], value: dataPair[1] })
      });
    return chartData
  };

  return (
    <>
      {coinMarketChartList.value[1][coin.id] &&
        <ResponsiveContainer height="100%" width="100%" className={classes.responsiveContainer}>
          <AreaChart
            data={formatRawData(coin.id, dataKey)}
            margin={{ top: 0, right: 8, left: 16, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gain ? 'gain' : 'loss'} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={gain ? theme.palette.success.main : theme.palette.error.main}
                  stopOpacity={0.5}
                />
                <stop
                  offset="60%"
                  stopColor={gain ? theme.palette.success.main : theme.palette.error.main}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <YAxis domain={[(dataMin: number) => dataMin * 0.95, (dataMax: number) => dataMax * 1.05]} hide />
            <Area
              type="monotone"
              dataKey="value"
              dot={false}
              animationDuration={3000}
              strokeWidth={2}
              stroke={gain ? theme.palette.success.main : theme.palette.error.main}
              fillOpacity={1}
              fill={`url(#${gain ? 'gain' : 'loss'})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      }
    </>
  )
}

export default SmallCoinChart
