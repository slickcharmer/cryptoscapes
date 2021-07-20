import React from 'react';
import { Theme, makeStyles, useTheme } from '@material-ui/core/styles';
import { Hidden, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useHistory } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { fetchCoinList, selectCoinList, setCoinQueryParams } from '../../../../features/coinListSlice';
import CoinListTableHeader, { headCells } from '../atoms/CoinListTableHeader';
import CoinNameCell from '../atoms/CoinNameCell';
import CirculatingSupplyCell from '../atoms/CirculatingSupplyCell';
import CoinSparkline from '../atoms/CoinSparkline';
import { Coin, CoinQueryParams, CoinSortingKey } from '../../../../models';
import { formatNumber, roundDecimals } from '../../../../common/helpers';
import { useInfiniteScrollingObserver } from '../../../../common/hooks/useInfiniteScrollingObserver';
import { useScrollToTop } from '../../../../common/hooks/useScrollToTop';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flex: 1,
    width: '100%',
    overflowY: 'scroll',
    position: 'relative'
  },
  tableContainer: {
    height: '100%',
    '& .MuiTableBody-root .MuiTableRow-root': {
      height: 83,
      cursor: 'pointer'
    },
    '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root': {
      borderBottom: 'none'
    },
    '& .MuiTableBody-root .MuiTableRow-root:hover .MuiTableCell-root': {
      backgroundColor: theme.palette.card.paper
    },
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    zIndex: 2,
    backgroundColor: theme.palette.card.default,
    [theme.breakpoints.down('xs')]: {
      position: 'relative',
      left: 'auto !important'
    }
  },
  chartWrapper: {
    height: 50,
    width: 180,
    float: 'right'
  }
}));

const CoinListTable: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();

  const history = useHistory();
  const dispatch = useAppDispatch();

  const coinList = useAppSelector(selectCoinList);

  const numberOfCols =
    coinList.coinListTableColumns.length + headCells.reduce((a, b) => a + (!b.customisable ? 1 : 0), 0);

  const [lastRef] = useInfiniteScrollingObserver(
    coinList.status,
    setCoinQueryParams({
      ...coinList.coinQueryParams,
      page: coinList.coinQueryParams.page + 1
    }),
    fetchCoinList({
      coinQueryParams: { ...coinList.coinQueryParams, page: coinList.coinQueryParams.page + 1 },
      append: true
    }),
    coinList.hasMore,
    0.1
  );

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: CoinSortingKey) => {
    const queryParams: CoinQueryParams = {
      ...coinList.coinQueryParams,
      sortingKey: property,
      sortingOrder: coinList.coinQueryParams.sortingOrder === 'asc' ? 'desc' : 'asc',
      page: 1
    };

    dispatch(fetchCoinList({ coinQueryParams: queryParams, append: false }));
    dispatch(setCoinQueryParams(queryParams));
  };

  const { FloatingButton, target, top } = useScrollToTop();

  return (
    <div className={classes.root}>
      <TableContainer className={classes.tableContainer} ref={target}>
        <Table stickyHeader>
          <CoinListTableHeader
            order={coinList.coinQueryParams.sortingOrder}
            orderBy={coinList.coinQueryParams.sortingKey}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {coinList.status === 'LOADING' ? (
              <>
                {Array.from(Array(coinList.coinQueryParams.perPage).keys()).map((index: number) => {
                  return <TableRow tabIndex={-1} key={index}>
                    {Array.from(Array(numberOfCols).keys()).map((index: number) => {
                      return <TableCell key={index}>
                        <Skeleton />
                      </TableCell>
                    })}
                  </TableRow>
                })}
              </>
            ) : (
              <>
                {coinList.value.map((coin: Coin, index: number) => {
                  const gain24H = coin.priceChangePercentage24HInCurrency >= 0;
                  const gain7D = coin.priceChangePercentage7DInCurrency >= 0;
                  return <TableRow
                    tabIndex={-1}
                    key={index}
                    ref={index === 0 ? top : coinList.value.length === index + 1 ? lastRef : null}
                    onClick={() => history.push(`/coins/${coin.id}`)}
                  >
                    <TableCell component="th" scope="row" className={classes.stickyColumn}>
                      <Typography variant="subtitle2" noWrap>
                        {coin.marketCapRank || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell className={classes.stickyColumn} style={{ left: 67 }} >
                      <CoinNameCell coin={coin} />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" noWrap>
                        ${formatNumber(coin.currentPrice)}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        display: coinList.coinListTableColumns.includes('priceChangePercentage24HInCurrency') ?
                          'table-cell' : 'none'
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        style={{ color: gain24H ? theme.palette.success.main : theme.palette.error.main }}
                        noWrap
                      >
                        {gain24H ? '+' : ''}{roundDecimals(coin.priceChangePercentage24HInCurrency)}%
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        display: coinList.coinListTableColumns.includes('priceChangePercentage7DInCurrency') ?
                          'table-cell' : 'none'
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        style={{ color: gain7D ? theme.palette.success.main : theme.palette.error.main }}
                        noWrap
                      >
                        {gain7D ? '+' : ''}{roundDecimals(coin.priceChangePercentage7DInCurrency)}%
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        display: coinList.coinListTableColumns.includes('marketCap') ?
                          'table-cell' : 'none'
                      }}
                    >
                      <Typography variant="subtitle2" noWrap>
                        ${formatNumber(coin.marketCap)}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        display: coinList.coinListTableColumns.includes('totalVolume') ?
                          'table-cell' : 'none'
                      }}
                    >
                      <Typography variant="subtitle2" noWrap>
                        ${formatNumber(coin.totalVolume)}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        display: coinList.coinListTableColumns.includes('circulatingSupply') ?
                          'table-cell' : 'none'
                      }}
                    >
                      <CirculatingSupplyCell coin={coin} />
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        display: coinList.coinListTableColumns.includes('sparklineIn7D') ?
                          'table-cell' : 'none'
                      }}
                    >
                      <div className={classes.chartWrapper}>
                        <CoinSparkline data={coin.sparklineIn7D?.price || []} gain={gain7D} />
                      </div>
                    </TableCell>
                  </TableRow>
                })}
                {coinList.hasMore && coinList.value.length !== 0 &&
                  <TableRow>
                    {Array.from(Array(numberOfCols).keys()).map((index: number) => {
                      return <TableCell key={index}>
                        <Skeleton />
                      </TableCell>
                    })}
                  </TableRow>
                }
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Hidden xsDown>
        <FloatingButton size="medium" color="secondary" />
      </Hidden>
    </div>
  );
}

export default CoinListTable