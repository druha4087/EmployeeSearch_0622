import { React, useState } from "react";
import { TextField, Button, Tooltip, Box, Typography, Modal } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import List from "./Components/List";
import Toggle from "./Components/Toggle";
import "./App.css";

function App() {
  //Search Input
  const [inputText, setInputText] = useState("");
  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  //Modal Hooks
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Modal Style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 10,
    borderRadius: 2,
    p: 4,
  };

  return (
    <div className="wrapper">
      <h1>Employee Search</h1>
      <div className="search">
        <TextField
          id="outlined-basic"
          onChange={inputHandler}
          variant="outlined"
          fullWidth
          label="Search"
          color="primary"
        />
        <Tooltip title="Filter" arrow>
          <Button variant="outlined" color="primary" onClick={handleOpen}><FilterListIcon>Filter</FilterListIcon></Button>
        </Tooltip>

        <Modal open={open} onClose={handleClose} aria-labelledby="title" aria-describedby="description">
          <Box sx={modalStyle}>
            <Typography id="title" variant="h6" component="h2">
              Search By 
            </Typography>
            <Typography id="description" sx={{ mt: 2 }}>
              --Search filters here--
            </Typography>
          </Box>
        </Modal>
        
      </div>
      <List input={inputText} />
      
    </div>
  );
}

export default App;