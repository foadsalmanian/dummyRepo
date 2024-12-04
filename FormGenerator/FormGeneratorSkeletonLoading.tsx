import { Grid, Skeleton } from '@mui/material';
import React from 'react';
import { IFormGenCnt, TFormGenRows, IFormGenRow } from 'types/TFormGen';
import { fakeArray } from 'utils/common';
import FormContainer from './FormContainer';

interface IFormGeneratorSkeletonLoadingProps {
  data: TFormGenRows;
}
const FormGeneratorSkeletonLoading = ({
  data,
}: IFormGeneratorSkeletonLoadingProps) => {
  const renderRowSklt = (row: IFormGenRow, idxIn: number) => {
    return (
      // eslint-disable-next-line react/no-array-index-key
      <Grid container key={idxIn}>
        {row?.map(item => {
          return (
            <Grid
              className='p-1'
              item
              key={item.name}
              lg={item.col?.lg}
              md={item.col?.md}
              sm={item.col?.sm ? item.col?.sm : 24}
              xs={item.col?.xs ? item.col?.xs : 24}
            >
              <Skeleton
                variant='text'
                className='w-24 mb-3 text-xl rounded'
                animation='wave'
              />

              <Skeleton
                variant='rectangular'
                className={`w-full text-4xl rounded ${
                  item.type === 'textArea' ? 'py-14' : ' max-w-lg'
                }`}
                animation='pulse'
              />
            </Grid>
          );
        })}
      </Grid>
    );
  };
  const renderContainerSklt = (cnt: IFormGenCnt, idxIn: number) => {
    return (
      <FormContainer {...cnt.containerProps}>
        {cnt.children.map((row, idx) => renderRowSklt(row, +`${idxIn}${idx}`))}
      </FormContainer>
    );
  };

  const renderContent = () =>
    data?.map((cnt, idx: number) => {
      if (!Array.isArray(cnt)) return renderContainerSklt(cnt, idx);

      return renderRowSklt(cnt, idx);
    });

  return (
    <>
      {data.length > 0 ? (
        renderContent()
      ) : (
        <>
          {fakeArray(4).map(i => {
            return (
              <Grid className='mb-10' container key={i}>
                {fakeArray(4).map(j => {
                  return (
                    <Grid
                      className='mb-10 '
                      item
                      key={j}
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                    >
                      <Skeleton
                        variant='text'
                        className='w-24 mb-3 text-xl rounded'
                        animation='wave'
                      />
                      <Skeleton
                        variant='rectangular'
                        className='w-full max-w-lg text-4xl rounded'
                        animation='pulse'
                      />
                    </Grid>
                  );
                })}
              </Grid>
            );
          })}
        </>
      )}
    </>
  );
};

export default FormGeneratorSkeletonLoading;
