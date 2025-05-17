'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';


export default function MyDataGrid({ 
    rows,
    col, 
    idName } : {

        rows: [];
        col: GridColDef[]
        idName: string;
    }) {

    const columns: GridColDef[] = col


  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        getRowId={(row) => row[idName]}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        checkboxSelection
      />
    </Box>
  );
}
