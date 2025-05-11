
import Button from '@mui/material/Button';
import MyDataGrid from '../ui/MyDataGrid';

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

            <Button 
                variant='contained'
                sx={{ bgcolor: 'primary'}}
            >Press</Button>
            </div>
        </>
    )
}