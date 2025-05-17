
import Button from '@mui/material/Button';
import MyDataGrid from '../ui/MyDataGrid';
import Box  from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default async function Page() {
    const data = await fetch('http://localhost:5280/api/students')
    const posts = await data.json()

    const col = [
        { field: 'studentId', headerName: 'ID', width: 90 },
        {
          field: 'firstName',
          headerName: 'First name',
          width: 200,
          editable: true,
        },
        {
          field: 'lastName',
          headerName: 'Last name',
          width: 200,
          editable: true,
        },
        {
          field: 'school',
          headerName: 'School',
        },
      ]; 



    return(
        <>
            <div>
            
            <MyDataGrid rows={posts} col={col} idName={'studentId'}/>

              <Box sx={{ margin: 2}}>
                <TextField label="First Name" variant='filled' />
                <TextField label="Last Name" variant='filled' />
                <TextField label="School" variant='filled' />
              </Box>

            <Button 
                variant='contained'
                sx={{ bgcolor: 'primary'}}
            >Post</Button>
            </div>
        </>
    )
}