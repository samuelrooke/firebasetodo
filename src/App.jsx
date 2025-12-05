// App.jsx
import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTodo from './AddTodo';
import './App.css';

ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  const [todos, setTodos] = useState([]);

  const [colDefs] = useState([
    { field: 'description', sortable: true, filter: true},
    { field: 'date', sortable: true, filter: true},
    { field: 'priority', sortable: true, filter: true},
    { 
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params => 
      <IconButton onClick={() => deleteTodo(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton> 
    }
  ]);

  useEffect(() => {
    fetchItems(); }, 
  [])

  const fetchItems = () => {
    fetch('https://todolist-b5b8b-default-rtdb.europe-west1.firebasedatabase.app/.json')
    .then(response => response.json())
    .then(data => addKeys(data))
    .then(data => setTodos(Object.values(data)))
    .catch(err => console.error(err))
  }

  // Add keys to the todo objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => 
    Object.defineProperty(item, 'id', {value: keys[index]}));
    setTodos(valueKeys);
  }

 const addTodo = (newTodo) => {
    fetch('https://todolist-b5b8b-default-rtdb.europe-west1.firebasedatabase.app/.json',
    {
      method: 'POST',
      body: JSON.stringify(newTodo)
    })
    .then(() => fetchItems())
    .catch(err => console.error(err))
  }

   const deleteTodo = (id) => {
    fetch(`https://todolist-b5b8b-default-rtdb.europe-west1.firebasedatabase.app/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(() => fetchItems())
    .catch(err => console.error(err))
  } 
  
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            TodoList
          </Typography>
        </Toolbar>
      </AppBar> 
      <AddTodo addTodo={addTodo} />  
      <div style={{ height: 500, width: 700 }}> 
        <AgGridReact 
          rowData={todos}
          columnDefs={colDefs}
        />
      </div>
      </>
  );
}

export default App;