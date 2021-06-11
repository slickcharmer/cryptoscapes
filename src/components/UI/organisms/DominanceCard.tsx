import React, { useEffect } from 'react';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { CardHeader } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchDominanceChartList, selectDominanceChartList } from '../../../features/dominanceChartList';
import CardLayout from '../molecules/CardLayout';
import CoinDominanceChart from '../atoms/CoinDominanceChart';
import { selectCoins } from '../../../features/coinsSlice';
import { Coin } from '../../../models';

const useStyles = makeStyles((theme: Theme) => ({
  chartWrapper: {
    width: '100%',
    height: 200
  }
}));

const DominanceCard: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const coins = useAppSelector(selectCoins);
  const dominanceChartList = useAppSelector(selectDominanceChartList);

  const top2Coins = coins.value.slice(0, 2);

  useEffect(() => {
    if (
      top2Coins.length === 2
      && Object.keys(dominanceChartList.value).length === 0
      && dominanceChartList.status === 'IDLE'
    ) {
      dispatch(fetchDominanceChartList(top2Coins.map((coin: Coin) => coin.id)));
    }
  }, [dispatch, top2Coins, dominanceChartList.value, dominanceChartList.status]);

  return (
    <CardLayout>
      <CardHeader
        title={
          top2Coins.length === 2 ?
            `${top2Coins[0].symbol.toUpperCase()} vs ${top2Coins[1].symbol.toUpperCase()} Dominance` :
            <Skeleton animation="wave" height={24} width="60%" />
        }
        titleTypographyProps={{ variant: 'body1' }}
        subheader={
          top2Coins.length === 2 ?
            "Market capitalization over last 30 days" :
            <Skeleton animation="wave" height={19} width="40%" />
        }
        subheaderTypographyProps={{ variant: 'caption', color: 'textSecondary' }}
      />
      <div className={classes.chartWrapper}>
        <CoinDominanceChart coinList={top2Coins} dataKey="marketCaps" />
      </div>
    </CardLayout>
  )
}

export default DominanceCard
